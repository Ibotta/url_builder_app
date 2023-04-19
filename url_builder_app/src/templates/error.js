/**
 * Template that renders a generic error message and link to our GitHub Issues page.
 */
export default function(error) {
  return (`
    <div class="error">
      <img src="warning.png" />
      <h4>Oops! Something went wrong! :(</h4>
      <p>${error}</p>
      <br/>
      <p>Please submit an issue below</p>
      <a class="btn btn-url" target="_blank" href="https://github.com/Ibotta/url_builder_app/issues">
        Submit Issue
      </a>
    </div>
  `);
}
