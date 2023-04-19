import React from 'react'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { UnorderedList } from '@zendeskgarden/react-typography'
import I18n from '../../javascripts/lib/i18n'
import { render, resizeContainer, escapeSpecialChars as escape, asyncErrorHandler, errorHandler } from '../../javascripts/lib/helpers'
import { getUrisFromSettings, getContext, buildTemplatesFromContext } from './context'
import getDefaultTemplate from '../../templates/default'

const MAX_HEIGHT = 1000
const API_ENDPOINTS = {
  organizations: '/api/v2/organizations.json'
}

class App {
  constructor (client, _appData) {
    this._client = client
    this.settings = _appData.metadata.settings;

    // this.initializePromise is only used in testing
    // indicate app initilization(including all async operations) is complete
    this.initializePromise = this.init()
  }

  /**
   * Initialize module, render main template
   */
  async init () {
    const currentUser = (await this._client.get('currentUser')).currentUser

    I18n.loadTranslations(currentUser.locale)

    const uris = errorHandler(this._client, getUrisFromSettings, this.settings);
    const context = await asyncErrorHandler(this._client, getContext, this._client);
    const templates = errorHandler(this._client, buildTemplatesFromContext, uris, context);

    render('.loader', getDefaultTemplate(templates))

    return resizeContainer(this._client, MAX_HEIGHT)

    const organizationsResponse = await this._client
      .request(API_ENDPOINTS.organizations)
      .catch(this._handleError.bind(this))

    const organizations = organizationsResponse ? organizationsResponse.organizations : []

    render(
      <ThemeProvider theme={{ ...DEFAULT_THEME }}>
        <Grid>
          <Row>
            <Col data-test-id='sample-app-description'>
              Hi {escape(currentUser.name)}, this is a sample app
            </Col>
          </Row>
          <Row>
            <Col>
              <span>{I18n.t('default.organizations')}:</span>
              <UnorderedList data-test-id='organizations'>
                {organizations.map(organization => (
                  <UnorderedList.Item key={`organization-${organization.id}`} data-test-id={`organization-${organization.id}`}>
                    {escape(organization.name)}
                  </UnorderedList.Item>
                ))}
              </UnorderedList>
            </Col>
          </Row>
        </Grid>
      </ThemeProvider>,
      appContainer
    )
    return resizeContainer(this._client, MAX_HEIGHT)
  }
}

export default App
