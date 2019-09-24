export function getTicketData(ticketId) {
    return {
        url: `/api/v2/tickets/${ticketId}.json`,
        type: 'GET',
        dataType: 'json'
    }
}
 
export function getUserData(userId) {
    return {
        url: `/api/v2/users/${userId}.json`,
        type: 'GET',
        dataType: 'json'
    }
}
 
export function getOrganizationData(orgId) {
    return {
        url: `/api/v2/organizations/${orgId}.json`,
        type: 'GET',
        dataType: 'json'
    }
}