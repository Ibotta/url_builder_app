import { templatingLoop as loop, escapeSpecialChars as escape } from '../javascripts/lib/helpers.js'

/**
 * Create a list item that is a button with a hyperlink.
 * @param {Object} uri - Object with a title for the button text and URL for the hyperlink
 */
function uriMarkup (uri) {
  return (`
    <li>
      <strong class="u-font-family-system u-semibold">
        <a href="${uri.url}" target="_blank" class="btn btn-url">${uri.title}</a>
      </strong>
    </li>
  `);
}

/**
 * Creates an unordered list, displayed as buttons, with hyperlinks.
 * @param {Array} templateUris - Array of text and URLs used to create buttons with hyperlinks.
 */
export default function (templateUris) {
  return (`
    <div id="well-urls" class="well well-small">
      <ul class="btn-list">${loop(templateUris, uriMarkup)}</ul>
    </div>
  `);
}
