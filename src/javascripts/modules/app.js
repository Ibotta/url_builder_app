import I18n from '../../javascripts/lib/i18n.js'
import { render, resizeContainer, asyncErrorHandler, errorHandler } from '../../javascripts/lib/helpers.js'
import { getUrisFromSettings, getContext, buildTemplatesFromContext } from './context.js'
import getDefaultTemplate from '../../templates/default.js'
import client from '../lib/client.js'

const MAX_HEIGHT = 1000

class App {
  constructor (_appData) {
    this.settings = _appData.metadata.settings

    this.initializePromise = this.init()
  }

  async init () {
    const currentUser = (await client.get('currentUser')).currentUser

    I18n.loadTranslations(currentUser.locale)

    const uris = errorHandler(getUrisFromSettings, this.settings)
    const context = await asyncErrorHandler(getContext)
    const templates = errorHandler(buildTemplatesFromContext, uris, context)

    render('.loader', getDefaultTemplate(templates))

    return resizeContainer(MAX_HEIGHT)
  }
}

export default App
