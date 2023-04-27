[![Build](https://github.com/Ibotta/url_builder_app/actions/workflows/build.yaml/badge.svg?branch=main)](https://github.com/Ibotta/url_builder_app/actions/workflows/build.yaml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

# URL Builder App V3

**NOTE: This app is not currently on the Zendesk Marketplace. ** . Please follow the [Usage Instructions](#usage-instructions) to use this in your Zendesk domain.

A Zendesk App to help you generate links for agents.

## Dependencies
```
"node": ">=18.12.1",
"zcli": ">=1.0.0-beta.32"
```

## Usage 
### Deploying from ZIP

To quickly install this application, navigate to the latest releases and download the attached `app-<DATE>.zip`.  You can upload this to Zendesk 
Attached to the latest release is the `app-<DATE>.zip` asset that can be [uploaded to your Zendesk instance](https://developer.zendesk.com/documentation/apps/getting-started/uploading-and-installing-a-private-app/#uploading-and-installing-a-private-app-in-zendesk):

1. In Admin Center, click the Apps and integrations icon () in the sidebar, then select Apps > Zendesk Support apps.
2. Click Upload App.
3. Enter a Name for the app.
4. Click Choose file and select the zip file for your private app.
5. Click Save.
6. In the pop-up box that appears, click Agree and upload this App.
7. When prompted, click Install.

#### Build, Test, and Upload

If you are interested in extending the app or simply building from source, check out the [CONTRIBUTING](./.github/CONTRIBUTING.md#compile-and-deploy-from-source) docs.

### Changing Settings

Once the app is uploaded, you can Install it to the configured areas of Zendesk.  You can update the JSON array by entering the Zendesk Admin Center > Apps & Integrations > Private Apps > (Whatever you named the app, or URL BuildeR app V3 by default).

### Configuring the JSON Array of URLs

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
    <a href="http://example.com/?name=Phillip_J_Fry">First Title</a>
  </li>
  <li>
    <a href="http://example.com/?custom=customValue">Second Title (with custom field)</a>
  </li>
</ul>
```

### Sample Placeholders

Below is a list of just a few of the available placeholders.  To see the full list of fields, please see the [Zendesk Apps Reference - API Reference](https://developer.zendesk.com/api-reference/apps/introduction/).  You can find fields available to [all locations](https://developer.zendesk.com/api-reference/apps/apps-support-api/all_locations/) and the [ticketsidebar](https://developer.zendesk.com/api-reference/apps/apps-support-api/ticket_sidebar/).

```
* {{ticket.id}}
* {{ticket.description}}
* {{ticket.requester.id}}
* {{ticket.requester.name}}
* {{ticket.requester.email}}
* {{ticket.requester.externalId}}
* {{ticket.requester.user_fields.YYY}} = custom user fields can be used
* {{ticket.assignee.user.id}}
* {{ticket.assignee.user.name}}
* {{ticket.assignee.user.email}}
* {{ticket.assignee.user.externalId}}
* {{ticket.assignee.group.id}}
* {{ticket.assignee.group.name}}
* {{ticket.custom_field_XXXXXXX}} // XXXXXXX = custom field id
* {{ticket.organization.organization_fields.XXXXXXX}} // XXXXXXX = Field key, default is field name
* {{currentUser.id}}
* {{currentUser.name}}
* {{currentUser.email}}
* {{currentUser.externalId}}
```

## Issues
To submit an issue, please follow the [available template](/.github/ISSUE_TEMPLATE.md).

## Contribution

Improvements are always welcome. To contribute, please submit detailed Pull Requests following the [guidelines](/.github/CONTRIBUTING.md).