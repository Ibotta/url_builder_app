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
  }
}
export const APP_DATA = {
  metadata: {
    settings: {
      uri_templates: "[]"
    }
  }
}
export const ORGANIZATIONS = {
  organizations: [
    { name: 'Organization A' },
    { name: 'Organization B' }
  ],
  next_page: null,
  previous_page: null,
  count: 1
}
