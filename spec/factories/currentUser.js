/**
 * Generates a Zendesk Current User object with random values
 * Randomly generated values are overidable through default params
 *
 * @param {*} ticketDefaults - Object to override the entire current user object
 *
 * @returns a new random Zendesk current user object
 */
const currentUserFactory = (useEndpoint = false, currentUserDefaults = {}) => {

  if (useEndpoint) {
    return {
      user: {
        user_fields: {
          field1: null,
          field2: null,
          field3: null,
        },
        ...currentUserDefaults,
      }
    }
  }
  return {
    currentUser: {
      externalId: null,
      id: faker.random.number(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      ...currentUserDefaults,
    }
  }
}

export default currentUserFactory;
