import express from 'express';
import { WebflowClient } from 'webflow-api';

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
  try {
    const accessToken = await WebflowClient.getAccessToken({
      clientId: process.env.CLIENT_ID || '',
      clientSecret: process.env.CLIENT_SECRET || '',
      code: code as string,
      redirectUri: process.env.REDIRECT_URI,
    });

    // NEED TO STORE THE ACCESS TOKEN IN A SECURE PLACE
    // I THINK THIS IS WHERE JWT COMES IN HANDY
    // For now, we will just send it back to the client
    console.log('Access Token:', accessToken);

    // Redirect the user to the frontend with the access token
    res.redirect('/');
  } catch (error) {
    console.error('Error during OAuth process:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
