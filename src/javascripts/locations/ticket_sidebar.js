import App from '../modules/app.js'

/* global ZAFClient */
const client = ZAFClient.init()
let fieldsToWatch = []
let app = {}

/**
 * Retrieves JSON array from app metadata settings, and parses which fields we support.
 * @param {String} uri_templates - String JSON array of URLs with title and URI address.
 */
function getFieldsToWatchFromSettings ({ uri_templates }) {
  return Array.from(new Set(
    JSON.parse(uri_templates)
      .flatMap(uri => {
        const matches = uri.url.match(/\{\{(.+?)\}\}/g) || [];
        return matches.map(f => f.slice(2, -2));
      })
  ));
}

/**
 * Event Listener that waits for app to be created; initiates the URL Builder app..
 */
client.on('app.registered', function (appData) {
  app = appData
  fieldsToWatch = getFieldsToWatchFromSettings(appData.metadata.settings)

  return new App(appData)
})

/**
 * Event listener that waits for any change events.  Reinitiates the app.
 * Example: Changing who ticket is assigned to will trigger 'ticket.assignee.user.id.changed'
 * We listen for the event, and update the app in case the URL Template data has changed.
 */
client.on('*.changed', e => {
  if (fieldsToWatch.includes(e.propertyName)) {
    return new App(app)
  }
})
