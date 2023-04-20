/**
 * Zendesk API function to retrieve full Ticket object via ticketId.
 *
 * @param {number} ticketId The ticketId the agent is currently viewing.
 * @return {Object} an Object used in the ZAFClient.request method to make the REST call.
 */
export function getTicketData (ticketId) {
  return {
    url: `/api/v2/tickets/${ticketId}.json`,
    type: 'GET',
    dataType: 'json'
  }
}

/**
 * Zendesk API function to retrieve full User object via userId.
 * @param {number} userId Assignee, Requester, or Current User's userId.
 * @return {Object} an Object used in the ZAFClient.request method to make the REST call.
 */
export function getUserData (userId) {
  return {
    url: `/api/v2/users/${userId}.json`,
    type: 'GET',
    dataType: 'json'
  }
}

/**
 * Zendesk API function to retrieve full Organization object via orgId.
 * @param {number} orgId Organization ID of the User or Ticket object.
 * @return {Object} an Object used in the ZAFClient.request method to make the REST call.
 */
export function getOrganizationData (orgId) {
  return {
    url: `/api/v2/organizations/${orgId}.json`,
    type: 'GET',
    dataType: 'json'
  }
}
