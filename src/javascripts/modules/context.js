import client from '../lib/client';
import { getTicketData } from "../lib/api";

const TEMPLATE_OPTIONS = { interpolate: /\{\{(.+?)\}\}/g };

/**
 * Parses a Zendesk users first and last name
 * from their Full name
 *
 * TODO: Docz
 *
 * @param {Object} user - A Zendesk User Object
 */
export function parseFirstLastName(user) {
  const [first_name = '', last_name = ''] = (user.name || '').split(' ');

  return {
    ...user,
    first_name,
    last_name,
  };
}

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
    mike.url = _.template(uri.url, TEMPLATE_OPTIONS)(context)
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
 * TODO: JS DOcs
 * @param {*} user 
 */
function parseFirstLastName(user) {
  const [first_name = '', last_name = ''] = (user.name || '').split(' ');

  return {
    ...user,
    first_name,
    last_name,
  };
}

/**
 * TODO: JS DOcs
 */
async function getContext() {
  function buildContext(ticket, currentUser) {
    let context = {};
    context.ticket = ticket;

    if (ticket.requester.id) {
      context.ticket.requester = parseFirstLastName(ticket.requester);

      /*
        // TODO: Look into organizations
        // this should be ticket.requester.organization_id
        if (context.ticket.requester.organization_id) {
          context.ticket.organization = _.find(data.organizations, org => {
            return org.id = context.ticket.requester.organization_id;
          });
        }
       */
    }

    if (ticket.assignee.id) {
      context.ticket.assignee.user = parseFirstLastName(ticket.assignee);
    }

    context.current_user = parseFirstLastName(currentUser);

    return context;
  };

  const { currentUser } = await client.get('currentUser');
  let { ticket } = await client.get('ticket');
  const ticketFields = await client.request(getTicketData(ticket.id));

  ticket = assignTicketFields(ticket, ticketFields);

  return buildContext(ticket, currentUser)
}

export default getContext;
