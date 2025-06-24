import express from 'express';
import { WebflowClient } from 'webflow-api';

import path from 'path';
import db from '../db/db';

const router = express.Router();

/**
 * AUTHORIZATION ROUTE
 * Creates a Webflow authorization URL and redirects the user to it.
 */
router.get('/', (req, res) => {
  // Create the authorization URL to direct the user to Webflow's Authorization
  const authorizeUrl = WebflowClient.authorizeURL({
    state: process.env.STATE,
    scope: [
      'authorized_user:read',
      'sites:read',
      'custom_code:read',
      'custom_code:write',
    ],
    clientId: process.env.WEBFLOW_CLIENT_ID || '',
    redirectUri: process.env.REDIRECT_URI,
  });
  res.redirect(authorizeUrl);
});

/**
 * CALLBACK ROUTE
 * Once the user has authorized their sites, Webflow will redirect them back to this route with a code and state
 */
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  // TODO: Implement this to prevent CSRF attacks
  if (state !== process.env.STATE) {
    res.status(400).send('State does not match');
  }

  // Get the access token from OAuth flow
  const accessToken = await WebflowClient.getAccessToken({
    clientId: process.env.WEBFLOW_CLIENT_ID || '',
    clientSecret: process.env.WEBFLOW_CLIENT_SECRET || '',
    code: code as string,
    redirectUri: process.env.REDIRECT_URI,
  });

  // Instantiate the Webflow Client with the access token
  const webflow = new WebflowClient({ accessToken });

  // Get site ID to pair with the authorization access token
  const sites = await webflow.sites.list();
  sites.sites?.forEach((site) => {
    console.log(`Site ID: ${site.id}`);
    // Add the site ID and access token to the database
    db.insertSiteAuthorization(site.id, accessToken);
  });

  // Send Auth Complete Screen with Post Message
  // TODO: Improve UX by showing a list of sites to return to, or by updating the HTML
  const filePath = path.resolve('public', 'authComplete.html');
  res.sendFile(filePath);
});

export default router;
