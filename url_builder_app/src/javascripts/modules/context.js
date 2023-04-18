/**
 * Parses the JSON Array of URI Templates from the app's settings.
 * @param {Object} uri_templates - URI Templates from app settings
 */
export function getUrisFromSettings({ uri_templates }) {
  return JSON.parse(uri_templates);
};
