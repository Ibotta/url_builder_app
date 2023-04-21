Note: Run commands in the root app directory.

Compile the app for DEV
===============
1) `npm install`
2) `npm run watch`
3) Open a new command line window in the root app directory
4) `zcli apps:server dist` will serve the app to your Zendesk instance.  When prompted, enter in a JSON formatted string with URLS (See README for more instructions on format).
5) Navigate to a ticket in your Zendesk instance and append the URL with `?zcli_apps=true`

Compile the app for PROD
===============
1) `npm install`
2) `npm run build`

To run the tests
===============
1) `npm install`
2) `npm run test`

Uploading the app
==============
1) `npm install`
2) `npm run build`
3) `npm validate` -- this uses `zcli` to validate any misconfigurations in the `manifest.json` or missing files in `dist`.
4) If you have not created the app in your instance yet, use `zcli apps:create dist` to do so.  If you have already uploaded the app, you can use `zcli apps:update dist` to update it.