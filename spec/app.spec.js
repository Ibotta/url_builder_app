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

describe('Example App', () => {
  let errorSpy
  let app

  describe('Initialization Failure', () => {
    beforeEach((done) => {
      document.body.outerHTML = '<body id="app"><section data-main><img class="loader" src="spinner.gif"/></section></body>'
      client.request = jest.fn().mockReturnValueOnce(Promise.reject(new Error('a fake error')))
      // helpers.resizeAppContainer = jest.fn().mockReturnValue(Promise.reject(new Error))
      app = new App(APP_DATA);
      errorSpy = jest.spyOn(helpers, 'asyncErrorHandler')

      app.initializePromise.then(() => {
        done()
      })
    })

    it('should display an error message in the console', () => {
      expect(errorSpy).toBeCalled()
    })
  })

  /*
  describe('Initialization Success', () => {
    beforeEach((done) => {
      document.body.innerHTML = '<section data-main><img class="loader" src="spinner.gif"/></section>'
      client.request = jest.fn().mockReturnValueOnce(Promise.resolve(ORGANIZATIONS))
      client.invoke = jest.fn().mockReturnValue(Promise.resolve({}))

      app = new App(client, {})

      app.initializePromise.then(() => {
        done()
      })
    })

    it('should render main stage with data', () => {
      expect(document.querySelector('.example-app')).not.toBe(null)
      expect(document.querySelector('h1').textContent).toBe('Hi Sample User, this is a sample app')
      expect(document.querySelector('h2').textContent).toBe('default.organizations:')
    })

    it('should retrieve the organizations data', () => {
      expect(app.states.organizations).toEqual([
        { name: 'Organization A' },
        { name: 'Organization B' }
      ])
    })
  })
   */
})
