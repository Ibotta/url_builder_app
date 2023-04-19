/* eslint-env jest, browser */
import App from '../src/javascripts/modules/app'
import i18n from '../src/javascripts/lib/i18n';
import { CLIENT, NO_APP_DATA, APP_DATA } from './mocks/mock'
import * as helpers from '../src/javascripts/lib/helpers';
import screen from '@testing-library/react';

const mockEN = {
  'app.name': 'Example App',
  'app.title': 'Example App',
  'default.organizations': 'organizations'
}

// describe('Example App', () => {
//   describe('Rendering', () => {
//     let appContainer = null

//     beforeEach(() => {
//       appContainer = document.createElement('section')
//       appContainer.classList.add('main')
//       document.body.appendChild(appContainer)
//     })

//     afterEach(() => {
//       unmountComponentAtNode(appContainer)
//       appContainer.remove()
//       appContainer = null
//     })

//     it('render with current username and organizations successfully', (done) => {
//       act(() => {
//         CLIENT.request = jest.fn().mockReturnValueOnce(Promise.resolve(ORGANIZATIONS))
//         CLIENT.invoke = jest.fn().mockReturnValue(Promise.resolve({}))

//         const app = new App(CLIENT, {})
//         app.initializePromise.then(() => {
//           const descriptionElement = screen.getByTestId('sample-app-description')
//           expect(descriptionElement.textContent).toBe('Hi Sample User, this is a sample app')

//           const organizations = screen.getByTestId('organizations')
//           expect(organizations.childElementCount).toBe(2)

//           const organizationA = screen.getByTestId('organization-1')
//           expect(organizationA.textContent).toBe('Organization A')
//           const organizationB = screen.getByTestId('organization-2')
//           expect(organizationB.textContent).toBe('Organization B')
//           done()
//         })
//       })
//     })

//     it('render with current username but no organizations since api errors', (done) => {
//       act(() => {
//         CLIENT.request = jest.fn().mockReturnValueOnce(Promise.reject(new Error('a fake error')))
//         const app = new App(CLIENT, {})
//         const errorSpy = jest.spyOn(app, '_handleError')

//         app.initializePromise.then(() => {
//           const descriptionElement = screen.getByTestId('sample-app-description')
//           expect(descriptionElement.textContent).toBe('Hi Sample User, this is a sample app')

//           const organizations = screen.getByTestId('organizations')
//           expect(organizations.childElementCount).toBe(0)

//           expect(errorSpy).toBeCalled()

//           done()
//         })
//       })
//     })
//   })
// })

// jest.mock('../src/javascripts/lib/i18n', () => {
//   return {
//     loadTranslations: jest.fn(),
//     t: key => key
//   }
// })
describe('App Initialization', () => {
  beforeAll(() => {
    i18n.loadTranslations('en')

    jest.mock('../src/translations/en', () => {
      return mockEN
    })
  })

  let errorSpy
  let app

  // describe('Initialization Failure', () => {
  //   beforeEach((done) => {
  //     document.body.id = 'app';
  //     document.body.innerHTML = '<section id="main" class="main"><img class="loader" src="spinner.gif"/></section>'

  //     app = new App(CLIENT, NO_APP_DATA);
  //     errorSpy = jest.spyOn(helpers, 'getUrisFromSettings');

  //     app.initializePromise
  //       .then(() => done());
  //   });

  //   it('should display an error when no templates are input', () => {
  //     expect(errorSpy).toBeCalled();
  //     expect(document.querySelector('.error')).not.toBe(null)
  //   })
  // })

  describe('Initialization Success', () => {
    beforeEach((done) => {
      document.body.id = 'app';
      document.body.innerHTML = '<section><img class="loader" src="spinner.gif"/></section>'
      app = new App(CLIENT, APP_DATA)

      app.initializePromise
        .then(() => done())
        .catch(() => done());
    })

    it('should render main stage with data', () => {
      expect(document.querySelector('#well-urls')).not.toBe(null)
    })
  })
})