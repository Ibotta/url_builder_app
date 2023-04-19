/* eslint-env jest, browser */
import App from '../src/javascripts/modules/app'
import i18n from '../src/javascripts/lib/i18n'
import { NO_APP_DATA, APP_DATA } from './mocks/mock'
import createRangePolyfill from './polyfills/createRange'
import * as helpers from '../src/javascripts/lib/helpers';
import mockCurrentUser from './factories/currentUser'
import mockTicket from './factories/ticket'
import client from '../src/javascripts/lib/client'

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
      jest.spyOn(console, 'error').mockImplementation(() => {});
      document.body.id = 'app';
      document.body.innerHTML = '<section id="main" class="main"><img class="loader" src="spinner.gif"/></section>'

      client.request = jest.fn().mockReturnValueOnce(Promise.reject(new Error('a fake error')));
      app = new App(NO_APP_DATA);
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
      app = new App(APP_DATA)
      client.request = jest.fn().mockImplementation(async ({ url }) => {
        if (url.includes('user')) {
          return mockCurrentUser(true);
        } else if(url.includes('tickets')) {
          return mockTicket(true);
        }
      });

      app.initializePromise
        .then(() => done())
        .catch(() => done());
    })

    it('should render main stage with data', () => {
      expect(document.querySelector('#well-urls')).not.toBe(null)
    })
  })
})