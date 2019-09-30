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

export const CONTEXT = {
  ticket: {
    description: "AGAIN my Tyson chicken rebate for $1.50 didn't go …ues and starting to get dissapointed. Please help",
    id: 4294709,
    isNew: false,
    updatedAt: "Tue May 14 2019 11:01:50 GMT-0600 (Mountain Daylight Time)",
    createdAt: "Wed Apr 03 2019 14:01:46 GMT-0600 (Mountain Daylight Time)",
    assignee: {
      user: {
        externalId: null,
        firstName: "Ashlee",
        id: 362029108248,
        lastName: "Esteban",
        name: "Ashlee Esteban",
        organizations: [],
        role: 8623767,
      },
    },
    requester: {
      externalId: "14177353",
      id: 16764970028,
      name: "Ladonna laster",
    },
    externalId: "14177353",
    id: 4294709,
  },
  currentUser: {
    externalId: null,
    id: 362168752739,
    name: "Michael Cavallaro"
  },
};