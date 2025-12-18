/* eslint camelcase: ["error", {allow: ["custom_field", "user_fields", "organization_fields"]}] */

import { getTicketData, getUserData, getOrganizationData } from '../lib/api.js'
import client from '../lib/client.js'

/**
 * Parses the JSON Array of URI Templates from the app's settings.
 * @param {Object} uriTemplates - URI Templates from app settings
 * @throws {Error} If JSON is invalid or doesn't meet required structure
 */
export function getUrisFromSettings ({ uriTemplates }) {
  try {
    const parsed = JSON.parse(uriTemplates)
    
    if (!Array.isArray(parsed)) {
      throw new Error('URI templates must be a JSON array')
    }
    
    parsed.forEach((uri, index) => {
      if (!uri.title || typeof uri.title !== 'string') {
        throw new Error(`URI at index ${index} missing required 'title' property`)
      }
      if (!uri.url || typeof uri.url !== 'string') {
        throw new Error(`URI at index ${index} missing required 'url' property`)
      }
    })
    
    return parsed
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in URI templates: ${error.message}`)
    }
    throw error
  }
};

/**
 * Replace placeholders in URIs with data from context.
 * @param {Array} uris - An array of JSON URI Objects, with a title and URIs.  The URIs have placeholders (See README).
 * @param {Object} context - An object containing user and ticket data.
 */
// Simple template function using {{key}} replacement with support for nested properties
function simpleTemplate (str, context) {
  const unresolvedFields = []
  
  const result = str.replace(/\{\{(.+?)\}\}/g, (match, key) => {
    const keys = key.trim().split('.')
    let value = context
    
    for (const k of keys) {
      if (value === undefined || value === null) {
        unresolvedFields.push(key.trim())
        return match // Return the original placeholder
      }
      value = value[k]
    }
    
    if (value === undefined || value === null) {
      unresolvedFields.push(key.trim())
      return match // Return the original placeholder
    }
    
    return value
  })
  
  return { result, unresolvedFields }
}

export function buildTemplatesFromContext (uris, context) {
  
  const errors = []
  
  const processedUris = uris.map((uri, index) => {
    const urlResult = simpleTemplate(uri.url, context)
    const titleResult = simpleTemplate(uri.title, context)
    
    // Check for unresolved placeholders
    const allUnresolved = [...new Set([...urlResult.unresolvedFields, ...titleResult.unresolvedFields])]
    
    if (allUnresolved.length > 0) {
      errors.push({
        index,
        title: uri.title,
        unresolvedFields: allUnresolved
      })
    }
    
    // Check for malformed URLs (double slashes, missing segments)
    const url = urlResult.result
    if (url.includes('///') || (url.includes('//') && !/^https?:\/\//.test(url))) {
      errors.push({
        index,
        title: uri.title,
        error: 'Malformed URL detected (missing path segments)'
      })
    }
    
    return {
      ...uri,
      url: urlResult.result,
      title: titleResult.result
    }
  })
  
  if (errors.length > 0) {
    console.error('[URL Builder] Template processing errors:', errors)
    const errorMessages = errors.map(e => {
      if (e.unresolvedFields) {
        return `"${e.title}": Failed to resolve fields: ${e.unresolvedFields.map(f => `{{${f}}}`).join(', ')}`
      }
      return `"${e.title}": ${e.error}`
    }).join('\n')
    
    throw new Error(`Unable to build URLs due to unresolved placeholders or malformed URLs:\n${errorMessages}\n\nPlease check that all required ticket fields are available.`)
  }
  
  return processedUris
}

/**
 * Takes the `custom_fields` object from the Ticket and assigns them to a copy Object
 * using the format `custom_field_ID######` as the key, and text as the custom field value.
 * @param {Object} ticket - ticket object retrieved from ZAFClient
 * @param {Object} ticketFields - Ticket object (with more data) retrieved from Zendesk API
 */
export function assignTicketFields (ticket, ticketFields) {
  const ticketCopy = Object.assign({}, ticket)

  if (ticketFields?.ticket?.custom_fields && Array.isArray(ticketFields.ticket.custom_fields)) {
    ticketFields.ticket.custom_fields.forEach(custom_field => {
      ticketCopy[`custom_field_${custom_field.id}`] = custom_field.value
    })
  } else {
    console.warn('[URL Builder] No custom fields found in ticket data')
  }

  return ticketCopy
}

/**
 * Adds the firstName, lastName, and user_fields objects to our existing User objets.
 * @param {Object} user - assignee, requester, or current user objects.
 */
export async function processUserObject (user) {
  if (!user) {
    console.warn('[URL Builder] processUserObject called with null/undefined user')
    return null
  }
  
  const [firstName = '', lastName = ''] = (user.name || '').split(' ')
  
  // If user has no ID, we can't fetch user_fields, but still return the user with name parts
  if (!user.id) {
    console.warn('[URL Builder] User has no ID, returning user with name parts only:', user)
    return {
      ...user,
      firstName,
      lastName,
      user_fields: {}
    }
  }
  
  try {
    const { user: { user_fields } } = await client.request(getUserData(user.id))
    
    return {
      ...user,
      firstName,
      lastName,
      user_fields
    }
  } catch (error) {
    console.error(`[URL Builder] Error fetching user fields for user ${user.id}:`, error)
    // Re-throw the error so calling code can handle it
    throw error
  }
}

/**
 * Retreives user and ticket data before building them into a single `context` object
 * used to replace our placeholders in the URIs with real data.
 */
export async function getContext () {
  /**
   * Builds a context object with the ZAFClient ticket, currentUser, assignee, and requester.
   * @param {Object} ticket - ZAFClient ticket object (current ticket agent is viewing)
   * @param {Object} currentUser - Current logged in user
   */
  async function buildContext (ticket, currentUser) {
    const context = {}
    context.ticket = ticket

    if (ticket.requester) {
      const processedRequester = await processUserObject(ticket.requester)
      if (processedRequester) {
        context.ticket.requester = processedRequester
      } else {
        console.warn('[URL Builder] Failed to process requester, requester data may be incomplete')
      }
    } else {
      console.warn('[URL Builder] Ticket has no requester')
    }

    if (ticket.assignee?.user) {
      const processedAssignee = await processUserObject(ticket.assignee.user)
      if (processedAssignee) {
        context.ticket.assignee.user = processedAssignee
      } else {
        console.warn('[URL Builder] Failed to process assignee, assignee data may be incomplete')
      }
    } else {
      console.warn('[URL Builder] Ticket has no assignee')
    }

    context.currentUser = await processUserObject(currentUser)

    return context
  };

  const { currentUser } = await client.get('currentUser')
  let { ticket } = await client.get('ticket')
  const ticketFields = await client.request(getTicketData(ticket.id))

  /**
   * Ticket organization is based on the nature of how the ticket was created.
   * If an organization is available and we can access it, we'll assign the fields.
   *
   * From Zendesk (https://support.zendesk.com/hc/en-us/articles/203690926-Updating-ticket-requesters-and-organizations):
   * - When a user who belongs to multiple organizations submits a ticket by email, it is assigned to their
   * - default organization. When the user creates a ticket in your Help Center, or when an agent creates a
   * - ticket on behalf of the user, the user or agent can select the organization for the ticket.
   */
  if (ticket.organization) {
    try {
      const { organization } = await client.request(getOrganizationData(ticket.organization.id))

      if (organization) {
        ticket.organization.organization_fields = organization.organization_fields
      }
    } catch (error) {
      console.error(`Error retrieving Organization fields for ${ticket.organization.id}: ${error}`)
    }
  }

  ticket = assignTicketFields(ticket, ticketFields)

  const finalContext = await buildContext(ticket, currentUser)
  
  return finalContext
}
