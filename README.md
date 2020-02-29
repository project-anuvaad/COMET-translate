## Videowiki Translate web component
`<vw-translate></vw-translate>`

This web component is part of www.videowiki.org and used for the translation stage

### Usage:
##### Include the following script in you page
`<script src="https://videowiki-microapps.s3-eu-west-1.amazonaws.com/vw-translate/v1.0.0.js" async />`

Use the web component `vw-proofread` anywhere on the page with the following properties  

`<vw-translate apiKey="" apiRoot="" articleId=""></vw-proofread>`
`
### Properties
- apiKey: Obtain an API key for your organization from the dashboard on www.videowiki.org
- apiRoot: The API to which the component will communicate, for integration with videowiki's original API use https://api.videowiki.org/api
- articleId: the `_id` field of the article that is to be translated