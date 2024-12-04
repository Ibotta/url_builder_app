import { templatingLoop as loop } from '../javascripts/lib/helpers.js'

/**
 * Create a list item that is a button with a hyperlink.
 * @param {Object} uri - Object with a title for the button text and URL for the hyperlink
 */
function uriMarkup (uri) {
  return (`
    <li class="url-list">
      <a href="${uri.url}" target="_blank" class="list-group-item list-group-item-action urls" role="button">${uri.title}</a>
    </li>
  `)
}

/**
 * Creates an unordered list, displayed as buttons, with hyperlinks.
 * @param {Array} templateUris - Array of text and URLs used to create buttons with hyperlinks.
 */
export default function (templateUris) {
  return (`
    <div id="well-urls" class="card">
      <ul class="list-group">${loop(templateUris, uriMarkup)}</ul>
    </div>
  `)
}
