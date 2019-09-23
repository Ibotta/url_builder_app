import App from '../modules/app'
import client from '../lib/client';
import { errorHandler } from '../lib/helpers';

let fieldsToWatch = [];
let app = {};

function getFieldsToWatchFromSettings({ uri_templates }) {
  return _.reduce(JSON.parse(uri_templates), function (memo, uri) {
    const fields = _.map(uri.url.match(/\{\{(.+?)\}\}/g), function (f) { return f.slice(2, -2) })
    return _.union(memo, fields)
  }, [])
}

// TODO: Check out appData
client.on('app.registered', appData => {
  app = appData;
  fieldsToWatch = errorHandler(getFieldsToWatchFromSettings, appData.metadata.settings);

  return new App(appData);
});


// On any change on zendesk instance
// Reinitialize app
// TODO: Test on changed event
client.on('*.changed', e => {
  if (_.contains(fieldsToWatch, e.propertyName)) {
    return new App(app);
  }
});

