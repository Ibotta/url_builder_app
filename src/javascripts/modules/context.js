import client from '../lib/client';
import { getTicketData } from "../lib/api";
import { getUserData } from "../lib/api";
import { getOrganizationData } from "../lib/api";

const TEMPLATE_OPTIONS = { interpolate: /\{\{(.+?)\}\}/g };

/**
 * Parses the JSON Array of URI Templates from the app's settings.
 * @param {Object} uri_templates - URI Templates from app settings
 */
export function getUrisFromSettings({ uri_templates }) {
  return JSON.parse(uri_templates);
};

/**
 * Replace placeholders in URIs with data from context.
 * @param {Array} uris - An array of JSON URI Objects, with a title and URIs.  The URIs have placeholders (See README).
 * @param {Object} context - An object containing user and ticket data.
 */
export function buildTemplatesFromContext(uris, context) {
  return _.map(uris, uri => {
    uri.url = _.template(uri.url, TEMPLATE_OPTIONS)(context)
    uri.title = _.template(uri.title, TEMPLATE_OPTIONS)(context)

    return uri;
  });
}

/**
 * Takes the `custom_fields` object from the Ticket and assigns them to a copy Object
 * using the format `custom_field_ID######` as the key, and text as the custom field value.
 * @param {Object} ticket - ticket object retrieved from ZAFClient
 * @param {Object} ticketFields - Ticket object (with more data) retrieved from Zendesk API
 */
export function assignTicketFields(ticket, ticketFields) {
  const ticketCopy = Object.assign({}, ticket);

  ticketFields.ticket.custom_fields.forEach(custom_field => {
    ticketCopy[`custom_field_${custom_field.id}`] = custom_field.value
  });

  return ticketCopy;
}

/**
 * Adds the firstName, lastName, and user_fields objects to our existing User objets.
 * @param {Object} user - assignee, requester, or current user objects.
 */
export async function processUserObject(user) {
  const [firstName = '', lastName = ''] = (user.name || '').split(' ');
  const { user: { user_fields } } = await client.request(getUserData(user.id));

  return {
    ...user,
    firstName,
    lastName,
    user_fields
  };
}

/**
 * Retreives user and ticket data before building them into a single `context` object
 * used to replace our placeholders in the URIs with real data.
 */
async function getContext() {
  /**
   * Builds a context object with the ZAFClient ticket, currentUser, assignee, and requester.
   * @param {Object} ticket - ZAFClient ticket object (current ticket agent is viewing)
   * @param {Object} currentUser - Current logged in user
   */
  async function buildContext(ticket, currentUser) {
    let context = {};
    context.ticket = ticket;

    if (ticket.requester.id) {
      context.ticket.requester = await processUserObject(ticket.requester);
    }

    if (ticket.assignee.user.id) {
      context.ticket.assignee.user = await processUserObject(ticket.assignee.user);
    }

    context.currentUser = await processUserObject(currentUser);

    return context;
  };

  const { currentUser } = await client.get('currentUser');
  let { ticket } = await client.get('ticket');
  const ticketFields = await client.request(getTicketData(ticket.id));

  /**
   * Tickets sometimes have a null organization.  If it is not null, get any custom fields for the org
   * and assign them to the ticket organization object.
   */
  if (ticket.organization) {
    const { organization } = await client.request(getOrganizationData(ticket.organization.id));
    ticket.organization.organization_fields = organization.organization_fields;
  }

  ticket = assignTicketFields(ticket, ticketFields);

  return await buildContext(ticket, currentUser)
}

export default getContext;
