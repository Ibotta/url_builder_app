/**
 * Template that renders a generic error message and link to our GitHub Issues page.
 */
export default function (error) {
  return (`
    <div id="error-card" class="card text-center">
      <div class="card-body">
        <div class="alert alert-danger" role="alert">
          ${error}
        </div>
        <p class="card-text">Please copy the error message above, and use the button below to submit an issue to the developer.</p>
        <p class="card-text">Provide a detailed description of the problem when submitting an issue.</p>
        <a class="btn btn-danger" target="_blank" href="https://github.com/Ibotta/url_builder_app/issues">
          Submit Issue
        </a>
      </div>
    </div>
  `)
}
