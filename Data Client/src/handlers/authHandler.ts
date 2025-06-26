import { WebflowClient } from 'webflow-api';
import path from 'path';
import db from '../db/db';
import axios from 'axios';
import jwt from '../utils/jwt';

/**
 * AUTHORIZE WEBFLOW
 * Creates a Webflow authorization URL and redirects the user to it.
 */
export function authorizeWebflow(req: any, res: any) {
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
}

/**
 * CALLBACK ROUTE
 * Once the user has authorized their sites, Webflow will redirect them back to this route with a code and state
 */
export async function authCallback(req: any, res: any) {
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

  // Add the site ID / access token pair to the database
  const sites = await webflow.sites.list();
  sites.sites?.forEach((site) => {
    db.insertSiteAuthorization(site.id, accessToken);
  });

  // Send Auth Complete Screen with Post Message
  const filePath = path.resolve('public', 'authComplete.html');
  res.sendFile(filePath);
}

/**
 * VALIDATE TOKEN
 * Resolves the ID Token by sending to Webflow, then creates a JWT session token and adds the user/access token pair to the db
 */
export async function validateToken(req: any, res: any) {
  const token = req.body.idToken;
  // Ensure there is an access token
  if (!req.accessToken) {
    res.status(401).json({ message: 'Access token is missing' });
    return;
  }
  // Resolve Session Token by making a request to Webflow API
  let sessionToken;
  try {
    const request = await axios.request({
      method: 'POST',
      url: 'https://api.webflow.com/beta/token/resolve',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.accessToken}`,
      },
      data: {
        idToken: token,
      },
    });

    const user = request.data;
    // Create a JWT
    const tokenPayload = jwt.createSessionToken(user);
    sessionToken = tokenPayload.sessionToken;
    // Add User / Access Token pair to the db
    db.insertUserAuthorization(user.id, req.accessToken);
    // Respond to user with sesion token
    res.json({ sessionToken, exp: tokenPayload.exp, user });
  } catch (error: any) {
    console.error('Unauthorized request' + error.message);
    res.status(error.status).json({
      error:
        'Error: Unauthorized request. User is not associated with authorization for this site.',
    });
  }
}
