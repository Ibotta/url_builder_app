# How to contribute to the URL Builder App V3

## Pull Requests

When making a pull request, be sure the merging repo is `ibotta/url_builder_app` and not `zendesklabs/url_builder_app`!

### **Did you find a bug?**

* **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/ibotta/url_builder_app/issues).

* If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/ibotta/url_builder_app/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

### **Did you write a patch that fixes a bug?**

* Open a new GitHub pull request with the patch.

* Ensure the PR description clearly describes the problem and solution. Include the relevant issue number if applicable.

### **Do you intend to add a new feature or change an existing one?**

* Suggest your change as a new issue and start writing code.

* Do not open an issue on GitHub until you have collected positive feedback about the change. GitHub issues are primarily intended for bug reports and fixes.

# Development Notes

## Setup

The app is configured to use [Node 18](https://nodejs.org/en/download).  We install node using [asdf-vm](https://asdf-vm.com/).

Once you are setup with Node, you can run `npm install` to get the dependencies ready.

### zcli

The Zendesk Command Lind Interface is the replacement of the Zendesk Apps Tools (ZAT) CLI and is used to build, test, and package Zendesk apps.  You can find out more [in the Developer Docs](https://developer.zendesk.com/documentation/apps/getting-started/using-zcli/).  

### API Reference

If you are interested in updating or extending the API references, you can check out the [Zendesk API Reference](https://developer.zendesk.com/api-reference/).

## Testing Changes

After you have made local changes, use `npm test` to run tests in Jest.  You can use webpack and `zcli` to test changes and live update the plugin:

In one terminal window:
```
# in the root directory
npm install
npm test
npm run watch
```

In another
```
# in the root directory
zcli apps:server dist
```

Navigate to a ticket in your Zendesk instance, and append `?zcli_apps=true` to the URL to load your local version of the app.

# Compile and deploy from source

Compiling the app from source uses [zcli](https://developer.zendesk.com/documentation/apps/getting-started/using-zcli/).  Follow the Zendesk docs to get set up and authenticate to your Zendesk instance.  

After authentication, follow these steps to compile and upload the app for the first time:

1) `npm install`
1) `npm test`
1) `npm run build` 
1) `zcli apps:validate dist` -- Validate the app and manifest.
1) `zcli apps:create dist` -- This will upload the app after validation to your Zendesk Instance.

## Updating the App with zcli

To update the app, you can use `zcli apps:update dist` after building.

## Generating a ZIP file

You can use `zcli apps:package dist` to generate a zip file into `dist/tmp` that you can manually upload.