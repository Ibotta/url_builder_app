import { faker } from '@faker-js/faker'
/**
 * Generates a Zendesk Current User object with random values
 * Randomly generated values are overidable through default params
 *
 * @param {*} useEndpoint - If true, returns format for API endpoint response; if false, returns user object directly
 * @param {*} currentUserDefaults - Object to override the user object properties
 *
 * @returns a new random Zendesk current user object
 */
const currentUserFactory = (useEndpoint = false, currentUserDefaults = {}) => {
  const userObject = {
    externalId: null,
    id: faker.number.int(),
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    ...currentUserDefaults
  }
  
  if (useEndpoint) {
    return {
      user: {
        user_fields: {
          field1: null,
          field2: null,
          field3: null
        },
        ...currentUserDefaults
      }
    }
  }
  
  // Return just the user object (no wrapper) to match how it's used in processUserObject
  return userObject
}

export default currentUserFactory
