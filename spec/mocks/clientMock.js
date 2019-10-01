import  mockCurrentUser from '../factories/currentUser';
import mockTicket from '../factories/ticket';

/**
 * Globably mocks the client library
 * Is overrideable by other test blocks
 */
const mockClient = () => {
  jest.mock('../../src/javascripts/lib/client', () => ({
    get: (endpoint) => {
      switch (endpoint) {
        case 'currentUser':
          return mockCurrentUser();
        case 'ticket':
          return mockTicket();
        default:
          return {};
      }
    },
    invoke: (height) => (height),
    request: ({ url }) => {
      if(url.includes('users')) {
        return mockCurrentUser(true);
      } else if (url.includes('tickets')) {
        return mockTicket(true);
      }
    },
  }));
}

export default mockClient;