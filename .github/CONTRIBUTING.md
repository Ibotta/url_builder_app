## How to contribute to the URL Builder App V3

### Pull Requests
When making a pull request, be sure the merging repo is `ibotta/url_builder_app` and not `zendesklabs/url_builder_app`!

#### **Did you find a bug?**

* **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/ibotta/url_builder_app/issues).

* If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/ibotta/url_builder_app/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

#### **Did you write a patch that fixes a bug?**

* Open a new GitHub pull request with the patch.

* Ensure the PR description clearly describes the problem and solution. Include the relevant issue number if applicable.

#### **Do you intend to add a new feature or change an existing one?**

* Suggest your change as a new issue and start writing code.

* Do not open an issue on GitHub until you have collected positive feedback about the change. GitHub issues are primarily intended for bug reports and fixes.

## Build Instructions

`npm run package` - This will build the `dist` folder locally after `validate` has passed.  `dist/tmp` will contain the ZIP you need to upload your version of the app.

### Testing changes using ZCLI

The Zendesk Command Lind Interface is the replace fo Zendesk Apps Tools (ZAT) and is used to build, test, and package Zendesk apps.  You can find out more [in the Developer Docs](https://developer.zendesk.com/documentation/apps/getting-started/using-zcli/)

### API Reference

If you are interested in updating or extending the API references, you can check out the [Zendesk API Reference](https://developer.zendesk.com/api-reference/).