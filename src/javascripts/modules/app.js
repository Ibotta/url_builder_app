/**
 *  Example app
 **/

import I18n from '../../javascripts/lib/i18n'
import { resizeAppContainer, render, asyncErrorHandler, errorHandler } from '../../javascripts/lib/helpers'
import getDefaultTemplate from '../../templates/default'
import getContext, { buildTemplatesFromContext, getUrisFromSettings } from './context'

class App {
  constructor (appData) {
    this.settings = appData.metadata.settings;
    this.init();
    /*
      // this.initializePromise is only used in testing
      // indicate app initilization(including all async operations) is complete
      this.initializePromise = this.init()
    */
  }

  /**
   * Initialize module, render main template
   */
  async init () {
    const uris = await asyncErrorHandler(getUrisFromSettings, this.settings);
    const context = await asyncErrorHandler(getContext);
    const templates = errorHandler(buildTemplatesFromContext, uris, context);

    return this.renderTemplates(templates);
  }

  renderTemplates(templates) {
    render('.loader', getDefaultTemplate(templates))

    return resizeAppContainer(this.client);
  }
}

export default App
