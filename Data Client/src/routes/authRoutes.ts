import express from 'express';
import { WebflowClient } from 'webflow-api';

import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  // Create the authorization URL to direct the user to Webflow's Authorization
  const authorizeUrl = WebflowClient.authorizeURL({
    state: process.env.STATE,
    scope: 'sites:read',
    clientId: process.env.CLIENT_ID || '',
    redirectUri: process.env.REDIRECT_URI,
  });
  res.send(authorizeUrl);
  res.redirect(authorizeUrl);
});

// Once the user has authorized their sites, Webflow will redirect them back to this route with a code and state
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  if (state !== process.env.STATE) {
    res.status(400).send('State does not match');
  }

  // Get the access token from OAuth flow
  const accessToken = await WebflowClient.getAccessToken({
    clientId: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || '',
    code: code as string,
    redirectUri: process.env.REDIRECT_URI,
  });

  // Instantiate the Webflow Client with the access token
  const webflow = new WebflowClient({ accessToken });
  // NEED TO STORE THE ACCESS TOKEN IN A SECURE PLACE
  // I THINK THIS IS WHERE JWT COMES IN HANDY
  // For now, we will just send it back to the client
  console.log('Access Token:', accessToken);

  // Get site ID to pair with the authorization access token
  const sites = await webflow.sites.list();
  sites.sites?.forEach((site) => {
    console.log(`Site ID: ${site.id}`);
    //db.insertSiteAuthorization(site.id, accessToken);
  });

  // Send Auth Complete Screen with Post Message
  // TODO: Improve UX by showing a list of sites to return to, or by updating the HTML
  const filePath = path.resolve('public', 'authComplete.html');
  res.sendFile(filePath);
});

// router.post("/token", jwt.retrieveAccessToken, async (req, res) => {

// });

export default router;
