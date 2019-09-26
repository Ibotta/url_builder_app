import App from '../modules/app'
import client from '../lib/client';
import { errorHandler } from '../lib/helpers';

let fieldsToWatch = [];
let app = {};

/**
 * Retrieves JSON array from app metadata settings, and parses which fields we support.
 * @param {String} uri_templates - String JSON array of URLs with title and URI address.
 */
function getFieldsToWatchFromSettings({ uri_templates }) {
  return _.reduce(JSON.parse(uri_templates), function (memo, uri) {
    const fields = _.map(uri.url.match(/\{\{(.+?)\}\}/g), function (f) { return f.slice(2, -2) })
    return _.union(memo, fields)
  }, [])
}

/**
 * Event Listener that waits for app to be created; initiates the URL Builder app..
 */
client.on('app.registered', appData => {
  app = appData;
  fieldsToWatch = errorHandler(getFieldsToWatchFromSettings, appData.metadata.settings);

  return new App(appData);
});


/**
 * Event listener that waits for any change events.  Reinitiates the app.
 * Example: Changing who ticket is assigned to will trigger 'ticket.assignee.user.id.changed'
 * We listen for the event, and update the app in case the URL Template data has changed.
 */
client.on('*.changed', e => {
  if (_.contains(fieldsToWatch, e.propertyName)) {
    return new App(app);
  }
});

