import { getTicketData, getUserData, getOrganizationData } from '../lib/api.js'
import client from '../lib/client.js'

const TEMPLATE_OPTIONS = { interpolate: /\{\{(.+?)\}\}/g }

/**
 * Parses the JSON Array of URI Templates from the app's settings.
 * @param {Object} uriTemplates - URI Templates from app settings
 */
export function getUrisFromSettings ({ uriTemplates }) {
  return JSON.parse(uriTemplates)
};

/**
 * Replace placeholders in URIs with data from context.
 * @param {Array} uris - An array of JSON URI Objects, with a title and URIs.  The URIs have placeholders (See README).
 * @param {Object} context - An object containing user and ticket data.
 */
// Simple template function using {{key}} replacement
function simpleTemplate (str, context) {
  return str.replace(/\{\{(.+?)\}\}/g, (_, key) => {
    return context[key.trim()] ?? ''
  })
}

export function buildTemplatesFromContext (uris, context) {
  return uris.map(uri => {
    uri.url = simpleTemplate(uri.url, context)
    uri.title = simpleTemplate(uri.title, context)
    return uri
  })
}

/**
 * Takes the `custom_fields` object from the Ticket and assigns them to a copy Object
 * using the format `custom_field_ID######` as the key, and text as the custom field value.
 * @param {Object} ticket - ticket object retrieved from ZAFClient
 * @param {Object} ticketFields - Ticket object (with more data) retrieved from Zendesk API
 */
export function assignTicketFields (ticket, ticketFields) {
  const ticketCopy = Object.assign({}, ticket)

  ticketFields.ticket.custom_fields.forEach(custom_field => {
    ticketCopy[`custom_field_${custom_field.id}`] = custom_field.value
  })

  return ticketCopy
}

/**
 * Adds the firstName, lastName, and user_fields objects to our existing User objets.
 * @param {Object} user - assignee, requester, or current user objects.
 */
export async function processUserObject (user) {
  const [firstName = '', lastName = ''] = (user.name || '').split(' ')
  const { user: { user_fields } } = await client.request(getUserData(user.id))

  return {
    ...user,
    firstName,
    lastName,
    user_fields
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
      context.ticket.requester = await processUserObject(ticket.requester)
    }

    if (ticket.assignee.user) {
      context.ticket.assignee.user = await processUserObject(ticket.assignee.user)
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

  return await buildContext(ticket, currentUser)
}
