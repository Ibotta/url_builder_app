import client from '../lib/client';
import { getTicketData } from "../lib/api";
import { getUserData } from "../lib/api";
import { getOrganizationData } from "../lib/api";

const TEMPLATE_OPTIONS = { interpolate: /\{\{(.+?)\}\}/g };

/**
 * TODO: JS DOcs
 * @param {*} settings - blah
 */
export function getUrisFromSettings({ uri_templates }) {
  return JSON.parse(uri_templates);
};

/**
 * TODO: JS DOcs
 * @param {*} uris 
 * @param {*} context 
 */
export function buildTemplatesFromContext(uris, context) {
  return _.map(uris, uri => {
    uri.url = _.template(uri.url, TEMPLATE_OPTIONS)(context)
    uri.title = _.template(uri.title, TEMPLATE_OPTIONS)(context)

    return uri;
  });
}

/**
 * TODO: JS DOcs
 * @param {*} ticket 
 */
function assignTicketFields(ticket, ticketFields) {
  const ticketCopy = Object.assign({}, ticket);

  ticketFields.ticket.custom_fields.forEach(custom_field => {
    ticketCopy[`custom_field_${custom_field.id}`] = custom_field.value
  });

  return ticketCopy;
}

/**
 * TODO: JS Docs
 * @param {*} user 
 */
async function processUserObject(user) {
  const [firstName = '', lastName = ''] = (user.name || '').split(' ');
  const { user: {user_fields}} = await client.request(getUserData(user.id));

  return {
    ...user,
    firstName,
    lastName,
    user_fields
  };
}

/**
 * TODO: JS DOcs
 */
async function getContext() {
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

  if (ticket.organization) {
    const { organization } = await client.request(getOrganizationData(ticket.organization.id));
    ticket.organization.organization_fields = organization.organization_fields;
  }

  ticket = assignTicketFields(ticket, ticketFields);

  return await buildContext(ticket, currentUser)
}

export default getContext;
