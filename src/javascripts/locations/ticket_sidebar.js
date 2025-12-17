import App from '../modules/app.js'
import { setTheme } from '../lib/theme.js'

/* global ZAFClient */

// Initialize theme from URL query parameter before ZAF client loads
const queryParams = new URLSearchParams(window.location.search)
const colorScheme = queryParams.get('colorScheme')
if (colorScheme) {
  setTheme(colorScheme)
}

const client = ZAFClient.init()
let fieldsToWatch = []
let app = {}

/**
 * Retrieves JSON array from app metadata settings, and parses which fields we support.
 * @param {String} uriTemplates - String JSON array of URLs with title and URI address.
 */
function getFieldsToWatchFromSettings ({ uriTemplates }) {
  return Array.from(new Set(
    JSON.parse(uriTemplates)
      .flatMap(uri => {
        const matches = uri.url.match(/\{\{(.+?)\}\}/g) || []
        return matches.map(f => f.slice(2, -2))
      })
  ))
}

/**
 * Event Listener that waits for app to be created; initiates the URL Builder app..
 */
client.on('app.registered', function (appData) {
  app = appData
  fieldsToWatch = getFieldsToWatchFromSettings(appData.metadata.settings)

  // Get initial color scheme from ZAF client (backup if query param wasn't available)
  client.get('colorScheme').then(data => {
    if (data.colorScheme) {
      setTheme(data.colorScheme)
    }
  }).catch(err => {
    console.warn('[URL Builder] Could not get colorScheme:', err)
  })

  return new App(appData)
})

/**
 * Event listener for color scheme changes (theme switching)
 */
client.on('colorScheme.changed', function (colorScheme) {
  console.log('[URL Builder] Color scheme changed to:', colorScheme)
  setTheme(colorScheme)
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
