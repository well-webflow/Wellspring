import express from 'express';
import jwt from '../utils/jwt';
import axios from 'axios';
import db from '../db/db';

const router = express.Router();

router.post('/', jwt.retrieveAccessToken, async (req, res) => {
  const token = req.body.idToken;

  console.log('Received ID Token:', token);

  // Ensure there is an access token
  if (!req.accessToken) {
    res.status(401).json({ message: 'Access token is missing' });
    return;
  }

  console.log('Access Token:', req.accessToken);

  // Resolve Session Token by making a request to Webflow API
  let sessionToken;
  try {
    const options = {
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
    };
    const request = await axios.request(options);
    const user = request.data;

    console.log('User data from Webflow API:', user);

    const tokenPayload = jwt.createSessionToken(user);
    sessionToken = tokenPayload.sessionToken;

    console.log('Session Token:', sessionToken);

    const expAt = tokenPayload.exp;
    db.insertUserAuthorization(user.id, req.accessToken);
    // Respond to user with sesion token
    res.json({ sessionToken, exp: expAt });
    return;
  } catch (error: any) {
    console.error('Unauthorized request' + error.message);
    res.status(error.status).json({
      error:
        'Error: Unauthorized request. User is not associated with authorization for this site.',
    });
  }
});

export default router;
