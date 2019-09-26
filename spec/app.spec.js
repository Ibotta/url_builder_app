/* eslint-env jest, browser */
import App from '../src/javascripts/modules/app'
import { APP_DATA } from './mocks/mock'
import createRangePolyfill from './polyfills/createRange'
import client from '../src/javascripts/lib/client';
import * as helpers from '../src/javascripts/lib/helpers';

jest.mock('../src/javascripts/lib/i18n', () => {
  return {
    loadTranslations: jest.fn(),
    t: key => key
  }
})

jest.mock('../src/javascripts/lib/client', () => ({
  get: (endpoint) => {
    switch (endpoint) {
      case 'currentUser':
        return {
          currentUser: {},
        }
      case 'ticket':
        return {
          ticket: {
            id: 1234,
          }
        }
      default:
        return {};
    }
  },
  invoke: () => {},
  request: () => {},
}));

if (!document.createRange) {
  createRangePolyfill()
}

describe('App Initialization', () => {
  let errorSpy
  let app

  describe('Initialization Failure', () => {
    beforeEach((done) => {
      document.body.id = 'app';
      document.body.innerHTML = '<section><img class="loader" src="spinner.gif"/></section>'

      client.request = jest.fn().mockReturnValueOnce(Promise.reject(new Error('a fake error')));
      app = new App(APP_DATA);
      errorSpy = jest.spyOn(helpers, 'asyncErrorHandler');

      app.initializePromise
      .then(() => done())
      .catch(() => done());
    });

    it('should display an error when no templates are input', () => {
      expect(errorSpy).toBeCalled();
      expect(document.querySelector('.error')).not.toBe(null)
    })
  })

  describe('Initialization Success', () => {
    beforeEach((done) => {
      document.body.id = 'app';
      document.body.innerHTML = '<section><img class="loader" src="spinner.gif"/></section>'

      client.request = jest.fn().mockReturnValueOnce(Promise.resolve({}))
      client.invoke = jest.fn().mockReturnValue(Promise.resolve({}))

      app = new App(APP_DATA)

      app.initializePromise.then(() => {
        done()
      });
    })

    it('should render main stage with data', () => {
      expect(document.querySelector('#app')).not.toBe(null)
    })
  })
})
