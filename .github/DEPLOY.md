Note: Run commands in the root app directory.

Compile the app for DEV
===============
1) `npm install`
2) `npm run watch`
3) Open a new command line window in the root app directory
4) `zcli apps:server dist` - Serves the app to your Zendesk instance with `?zcli_apps=true`
5) `[{"title": "Google", "url": "https://google.com/"}, {"title": "Ibotta", "url": "https://ibotta.com/"}]` for test json

Compile the app for PROD
===============
1) `npm install`
2) `npm run build`

To run the tests
===============
1) `npm install`
2) `npm run test`
