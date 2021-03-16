## COMET Translate web component
`<vd-translate></vd-translate>`

This web component is part of comet.anuvaad.org and used for the translation stage

### Usage:
Use the web component `vd-translate` anywhere on the page with the following properties  

`<vd-translate apiKey="" apiRoot="" articleId=""></vd-translate>`
`
### Properties
- apiKey: Obtain an API key for your organization from the dashboard on comet.anuvaad.org
- apiRoot: The API to which the component will communicate, for integration with COMET's original API use https://comet.anuvaad.org/api
- articleId: the `_id` field of the article that is to be translated
- backRoute: the location/route to which the component should redirect when the user press the back button.
