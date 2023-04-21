/* eslint-env jest, browser */
import App from '../src/javascripts/modules/app.js'
import i18n from '../src/javascripts/lib/i18n.js'
import { APP_DATA } from './mocks/mock.js'
import createRangePolyfill from './polyfills/createRange.js'
import * as helpers from '../src/javascripts/lib/helpers.js'
import mockCurrentUser from './factories/currentUser.js'
import mockTicket from './factories/ticket.js'
import client from '../src/javascripts/lib/client.js'

const mockEN = {
  'app.name': 'Example App',
  'app.title': 'Example App',
  'default.organizations': 'organizations'
}

if (!document.createRange) {
  createRangePolyfill()
}

describe('App Initialization', () => {
  beforeAll(() => {
    i18n.loadTranslations('en')

    jest.mock('../src/translations/en', () => {
      return mockEN
    })
  })

  let errorSpy
  let app

  describe('Initialization Failure', () => {
    beforeEach((done) => {
      jest.spyOn(console, 'error').mockImplementation(() => {})
      document.body.id = 'app'
      document.body.innerHTML = '<section id="main" class="main"><img class="loader" src="spinner.gif"/></section>'

      client.request = jest.fn().mockReturnValueOnce(Promise.reject(new Error('a fake error')))
      app = new App(APP_DATA)
      errorSpy = jest.spyOn(helpers, 'asyncErrorHandler')

      app.initializePromise
        .then(() => done())
        .catch(() => done())
    })

    it('should display an error when no templates are input', () => {
      expect(errorSpy).toBeCalled()
      expect(document.querySelector('.error')).not.toBe(null)
    })
  })

  describe('Initialization Success', () => {
    beforeEach((done) => {
      document.body.id = 'app'
      document.body.innerHTML = '<section><img class="loader" src="spinner.gif"/></section>'
      app = new App(APP_DATA)
      client.request = jest.fn().mockImplementation(async ({ url }) => {
        if (url.includes('user')) {
          return mockCurrentUser(true)
        } else if (url.includes('tickets')) {
          return mockTicket(true)
        }
      })

      app.initializePromise
        .then(() => done())
        .catch(() => done())
    })

    it('should render main stage with data', () => {
      expect(document.querySelector('#well-urls')).not.toBe(null)
    })
  })
})
