/**
 *  URL Builder App
 **/
import { resizeAppContainer, render, asyncErrorHandler, errorHandler } from '../../javascripts/lib/helpers'
import getDefaultTemplate from '../../templates/default'
import getContext, { buildTemplatesFromContext, getUrisFromSettings } from './context'

class App {
  constructor (appData) {
    this.settings = appData.metadata.settings;

    // this.initializePromise is only used in testing
    // indicate app initilization(including all async operations) is complete
    this.initializePromise = this.init()
  }

  /**
   * Initialize module, render main template
   *
   * Steps:
   * 1. Retreive URIs from app settings.
   * 2. Build a context object with ticket and user data.
   * 3. Templates are built using the URI and Context to replace URL Placeholders with data from context.
   * 4. Render these templates as buttons.
   */
  async init () {
    const uris = await asyncErrorHandler(getUrisFromSettings, this.settings);
    const context = await asyncErrorHandler(getContext);
    const templates = errorHandler(buildTemplatesFromContext, uris, context);

    return this.renderTemplates(templates);
  }

  /**
   * An Array of Objects, with a "title" and "uri".
   * The title is rendered as the button text, and the URI is the HTML link.
   * @param {Array} templates
   */
  renderTemplates(templates) {
    render('.loader', getDefaultTemplate(templates))

    return resizeAppContainer(this.client);
  }
}

export default App