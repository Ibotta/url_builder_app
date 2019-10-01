import client from '../lib/client';
import getErrorTemplate from '../../templates/error';

/**
 * Resize App Container
 *
 * Resizes the app based off of the app element's size
 * Allows for custom, overridable, dimensions to be passed as well
 * @param {ZAFClient} client ZAFClient object
 * @param {...Object} dimensions - an optional param to override
 *                                 automatic size calculation
 */
export function resizeAppContainer (dimensions) {
  if (dimensions) {
    return client.invoke('resize', { ...dimensions })
  }

  const { clientHeight = '300px' } = document.getElementById('app');

  return client.invoke('resize', { height: clientHeight });
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
 * @param {Error} error Exception caught by our error handling functions.
 */
export function renderErrorTemplate(error) {
  console.error(error);

  render('.loader', getErrorTemplate(error));
  return resizeAppContainer();
}

/**
 * Wraps synchronous function calls in an error handler.
 * @param {*} func Synchronous client function call.
 * @param  {...any} params Function parameters used in the call.
 */
export function errorHandler(func, ...params) {
  try {
    return func(...params);
  } catch (err) {
    renderErrorTemplate(err);
  }
}

/**
 * Wraps async function calls in an error handler.
 * @param {*} asyncFunction Asynchronous client function call.
 * @param  {...any} params Function parameters used in the call.
 */
export async function asyncErrorHandler(asyncFunction, ...params) {
  try {
    return await asyncFunction(...params);
  } catch (err) {
    renderErrorTemplate(err);
  }
}