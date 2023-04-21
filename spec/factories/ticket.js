import customFieldFactory from './customFields.js'
import { faker } from '@faker-js/faker'

/**
 * Generates a Zendesk Ticket object with random values
 * Randomly generated values are overidable through default params
 *
 * @param {Boolean} useEndpoint - Decides whether to generate ticket from client/endpoint
 * @param {Object} ticketDefaults - Object to override the entire ticket object
 * @param {Object} requesterDefaults - Object to override the child, requester object
 * @param {Object} assigneeUserDefault - Object to override the user object within the assignee object
 *
 * @returns a new random Zendesk ticket object
 */
const ticketFactory = (useEndpoint = false, ticketDefaults = {}, requesterDefaults = {}, assigneeUserDefault = {}) => {
  // When using the endpoint, the only field we care about is custom_fields
  if (useEndpoint) {
    return {
      ticket: {
        custom_fields: customFieldFactory(),
        ...ticketDefaults
      }
    }
  }

  const requester = {
    externalId: `${faker.datatype.number()}`,
    id: faker.datatype.number(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    ...requesterDefaults
  }

  const assigneeFirstName = faker.name.firstName()
  const assigneeLastName = faker.name.lastName()
  const assignee = {
    user: {
      externalId: null,
      firstName: assigneeFirstName,
      id: faker.datatype.number(),
      lastName: assigneeLastName,
      name: `${assigneeFirstName} ${assigneeLastName}`,
      ...assigneeUserDefault
    }
  }

  return {
    ticket: {
      id: faker.datatype.number(),
      assignee,
      requester,
      externalId: `${faker.datatype.number()}`,
      ...ticketDefaults
    }
  }
}

export default ticketFactory
