# Overview
The V2 version of this app seeks to offer the same functionality as the [V1 version](https://github.com/zendesklabs/url_builder_app).  During the development process, we used the [Zendesk App Scaffold](https://github.com/zendesk/app_scaffold) as a template and made improvements to the maintainability of the code base.  We reviewed the [existing issues outlined](https://github.com/zendesklabs/url_builder_app/issues) for areas we can address, as well as identified some small issues we fixed.  These are outlined below.

## Changed Keys
ticket.requester.firstname -> ticket.requester.firstName
ticket.requester.lastname -> ticket.requester.lastName
ticket.assignee.firstname -> ticket.assignee.firstName
ticket.assignee.lastname -> ticket.assignee.lastName
current_user.firstname -> currentUser.firstName
current_user.lastname -> currentUser.lastName

### Note about `externalId` vs `external_id` keys
We noticed the README mentioned using `ticket.requester.externalId`, but this appeared to be replaced with `external_id`.  This is due to the User object called via Zendesk API using snake_case keys while the ZAFClient's ticket object uses camelCase keys.  We no longer use the API call, and now the `externalId` is the usage of this key.

### Note about `firstName` and `lastName` keys
The Zendesk API and ZAFClient provide two different depths of information on User type objects.  The API call returns [a detailed object](https://developer.zendesk.com/rest_api/docs/support/users#json-format-for-agent-or-admin-requests) while the ZAFClient's `ticket.[requester, assignee` and `currentUser` objects are [less detailed](https://developer.zendesk.com/apps/docs/support-api/all_locations#user-object).  In addition, we noticed the object keys from the ZAFClient come back as camelCase while the Zendesk API returns snake_case keys.  

The detailed User object was used to get the full name and then split them into the `firstname` and `lastname` keys.  However, with the ZAFClient `ticket` object, we were able to replicate the same functionality without the extra API call and logic to map this.  The keys are still present but now follow camelCase naming.

## Error Handling
The V2 version of this app will now display an error message and link to the V2 app's GitHub Issues page when an error occurs.  There are steps outlined to file an issue there and what we will need to help you troubleshoot the issues. 

# Upcoming App Improvements
We're always interested in ways to improve this app for agents and developers!  Please create an issue or PR detailing your ideas!  Below, you will find a few ideas we have to make this app an even better experience.

## URL Sanitization
We noticed that if a ticket did not have an assignee or was requested via email, and a Zendesk User was not matched to the email, then the `ticket.requester` fields became null.  This caused some URLs to have issues.  

An example of this issue that we observed:
```javascript
[
  {
    "title": "Example URL",
    "url": "http://example.com/?name={{ticket.requester.name}}"
  },
  {
    "title": "User Profile",
    "url": "http://example.com/user/{{ticket.requester.id}}/profile"
  }
]
```

Would generate:
```html
<ul>
  <li>
    <a href="http://example.com/?name=">Example URL</a>
  </li>
  <li>
    <a href="http://example.com/user//profile">User Profile</a>
  </li>
</ul>
```

To resolve this, we want to sanitize URLs to provide an error message when a field referenced does not have a value.  

## Specific Error Messages
Currently, our error handling creates a warning image and reference to our GitHub Issues page.  We would like to expand on this to provide specific error handling cases, like Zendesk's API returning an error, or a field referenced in the JSON URL that is not supported.

## TODOS

### Custom Field Naming
Should `ticket.requester.user_fields.YYY`, `ticket.custom_field_XXXXXX`, `ticket.organization.organization_fields.XXXXXX` be renamed to be consistent?  I noticed that these fields used to be referenced via the `containerContext` object, and are now retrieved via Zendesk API calls.  I'd like to have these fields available, but use consistent naming across them.