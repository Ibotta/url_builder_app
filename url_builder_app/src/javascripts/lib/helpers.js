import getErrorTemplate from '../../templates/error';

const MAX_HEIGHT = 1000

/**
 * Resize App container
 * @param {ZAFClient} client ZAFClient object
 * @param {Number} max max height available to resize to
 * @return {Promise} will resolved after resize
 */
export function resizeContainer (client, max = Number.POSITIVE_INFINITY) {
  const newHeight = Math.min(document.body.clientHeight, max)
  return client.invoke('resize', { height: newHeight })
}

/**
 * Helper to render a dataset using the same template function
 * @param {Array} set dataset
 * @param {Function} getTemplate function to generate template
 * @param {String} initialValue any template string prepended
 * @return {String} final template
 */
export function templatingLoop (set, getTemplate, initialValue = '') {
  return set.reduce((accumulator, item, index) => {
    return `${accumulator}${getTemplate(item, index)}`
  }, initialValue)
}

/**
 * Render template
 * @param {String} replacedNodeSelector selector of the node to be replaced
 * @param {String} htmlString new html string to be rendered
 */
export function render (replacedNodeSelector, htmlString) {
  const fragment = document.createRange().createContextualFragment(htmlString)
  const replacedNode = document.querySelector(replacedNodeSelector)

  if (replacedNode) {
    replacedNode.parentNode.replaceChild(fragment, replacedNode)
  }
}

/**
 * Helper to escape unsafe characters in HTML, including &, <, >, ", ', `, =
 * @param {String} str String to be escaped
 * @return {String} escaped string
 */
export function escapeSpecialChars (str) {
  if (typeof str !== 'string') throw new TypeError('escapeSpecialChars function expects input in type String')

  const escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
    '=': '&#x3D;'
  }

  return str.replace(/[&<>"'`=]/g, function (m) { return escape[m] })
}

/**
 * Logs error message and renders our error template.
 * @param {ZAFClient} client ZAFClient object
 * @param {Error} error Exception caught by our error handling functions.
 */
export function renderErrorTemplate(client, error) {
  console.error(error);

  render('.loader', getErrorTemplate(error));
  return resizeContainer(client, MAX_HEIGHT);
}

/**
 * Wraps synchronous function calls in an error handler.
 * @param {ZAFClient} client ZAFClient object
 * @param {*} func Synchronous client function call.
 * @param  {...any} params Function parameters used in the call.
 */
export function errorHandler(client, func, ...params) {
  try {
    return func(...params);
  } catch (err) {
    renderErrorTemplate(client, err);
  }
}

/**
 * Wraps async function calls in an error handler.
 * @param {ZAFClient} client ZAFClient object
 * @param {*} asyncFunction Asynchronous client function call.
 * @param  {...any} params Function parameters used in the call.
 */
export async function asyncErrorHandler(client, asyncFunction, ...params) {
  try {
    return await asyncFunction(...params);
  } catch (err) {
    renderErrorTemplate(client, err);
  }
}