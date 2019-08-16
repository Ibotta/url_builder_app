[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Build Status](https://travis-ci.com/Ibotta/url_builder_app.svg?branch=master)](https://travis-ci.com/Ibotta/url_builder_app)
[![Maintainability](https://api.codeclimate.com/v1/badges/ae9af0fae166c51f8f8a/maintainability)](https://codeclimate.com/repos/5d9242ca2d833400b1000180/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ae9af0fae166c51f8f8a/test_coverage)](https://codeclimate.com/repos/5d9242ca2d833400b1000180/test_coverage)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](.github/CODE_OF_CONDUCT.md)

# URL Builder App V2

## Description:

A Zendesk App to help you generate links for agents.

## Changes from V1 to V2
We've included some helpful information about what has changed in the V2 of this app in our [Wiki](https://github.com/Ibotta/url_builder_app/wiki/Changes-from-V1-to-V2)

## Instructions:

1. Download a [.zip of this app](https://github.com/ibotta/url_builder_app/archive/master.zip)
2. Navigate to your Zendesk Admin's Apps -> Manage page
3. Click `Upload App`
4. Enter a descriptive name of your choosing, and upload this .zip
5. Click `Upload`
6. Confirm the title, the second box is for the `json`, described below.
7. Optionally enable role restrictions if these URLs are not appropriate for all agents.
8. Once your .json is in place, click `Install`.
9. Open a new browser to test your results.

## JSON Array of URLs:

The following is an example of what can be entered into this app's settings:

```javascript
[
  {
    "title": "First Title",
    "url": "http://example.com/?name={{ticket.requester.name}}"
  },
  {
    "title": "Second Title (with custom field)",
    "url": "http://example.com/?custom={{ticket.custom_field_424242}}"
  }
]

```
This example will generate the following HTML inside the app:
```html
<ul>
  <li>
    <a href="http://example.com/?name=Robert C.Martin">First Title</a>
  </li>
  <li>
    <a href="http://example.com/?custom=secretRocketLaunchCodes">Second Title (with custom field)</a>
  </li>
</ul>
```

----
### Available Placeholders
* {{ticket.id}} //not available for new tickets
* {{ticket.description}}
* {{ticket.requester.id}}
* {{ticket.requester.name}}
* {{ticket.requester.email}}
* {{ticket.requester.externalId}}
* {{ticket.requester.firstName}}
* {{ticket.requester.lastName}}
* {{ticket.requester.user_fields.YYY}} = custom user fields can be used
* {{ticket.assignee.user.id}}
* {{ticket.assignee.user.name}}
* {{ticket.assignee.user.email}}
* {{ticket.assignee.user.externalId}}
* {{ticket.assignee.user.firstName}}
* {{ticket.assignee.user.lastName}}
* {{ticket.assignee.group.id}}
* {{ticket.assignee.group.name}}
* {{ticket.custom_field_XXXXXXX}} // XXXXXXX = custom field id
* {{ticket.organization.organization_fields.XXXXXXX}} // XXXXXXX = Field key, default is field name
* {{currentUser.id}}
* {{currentUser.name}}
* {{currentUser.email}}
* {{currentUser.externalId}}
* {{currentUser.firstName}}
* {{currentUser.lastName}}

### Making changes

If you wish to change the output, locate the app by looking for the name you choose in step 4 above. Use the widget to `Change Settings`

<img width="195" src="https://github.com/watchmanmonitoring/url_builder_app/raw/master/assets/app-settings-change.png" />

## Issues
To submit an issue, please follow the [available template](/.github/ISSUE_TEMPLATE.md).

## Contribution

Improvements are always welcome. To contribute, please submit detailed Pull Requests following the [guidelines](/.github/CONTRIBUTING.md).

## Screenshot(s):
![screenshot-1](/assets/screenshot.png)
