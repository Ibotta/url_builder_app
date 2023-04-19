export const CLIENT = {
  _origin: 'zendesk.com',
  get: (prop) => {
    if (prop === 'currentUser') {
      return Promise.resolve({
        currentUser: {
          locale: 'en',
          name: 'Sample User'
        }
      })
    }
    return Promise.resolve({
      [prop]: null
    })
  },
  invoke: (prop) => {
    return Promise.resolve({
      [prop]: null
    })
  }
}

export const APP_DATA = {
  metadata: {
    settings: {
      uri_templates: '[{"title": "Google", "url": "https://google.com/"}, {"title": "Ibotta", "url": "https://ibotta.com/"}]'
    }
  }
}

export const NO_APP_DATA = {
  metadata: {
    settings: {
      uri_templates: '[]'
    }
  }
}

export const ORGANIZATIONS = {
  organizations: [
    { id: 1, name: 'Organization A' },
    { id: 2, name: 'Organization B' }
  ],
  next_page: null,
  previous_page: null,
  count: 1
}
