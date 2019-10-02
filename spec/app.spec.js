/* eslint-env jest, browser */
import App from '../src/javascripts/modules/app'
import { APP_DATA } from './mocks/mock'
import createRangePolyfill from './polyfills/createRange'
import client from '../src/javascripts/lib/client';
import * as helpers from '../src/javascripts/lib/helpers';
import mockTicket from './factories/ticket';
import mockCurrentUser from './factories/currentUser';

jest.mock('../src/javascripts/lib/i18n', () => {
  return {
    loadTranslations: jest.fn(),
    t: key => key
  }
})

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
      app = new App(APP_DATA)
      client.request = jest.fn().mockImplementation(async ({ url }) => {
        if (url.includes('user')) {
          return mockCurrentUser(true);
        } else if(url.includes('tickets')) {
          return mockTicket(true);
        }
      });

      app.initializePromise.then(() => {
        done()
      });
    })

    it('should render main stage with data', () => {
      expect(document.querySelector('#app')).not.toBe(null)
    })
  })
})
