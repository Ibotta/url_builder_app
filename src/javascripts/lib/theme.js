/**
 * Sets the theme for the application by updating the data-theme attribute.
 * @param {string} scheme - The color scheme ('light' or 'dark')
 */
export function setTheme (scheme) {
  if (scheme === 'light' || scheme === 'dark') {
    document.documentElement.setAttribute('data-theme', scheme)
    console.log(`[URL Builder] Theme set to: ${scheme}`)
  } else {
    console.warn(`[URL Builder] Invalid theme scheme: ${scheme}`)
  }
}
