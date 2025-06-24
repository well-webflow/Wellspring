import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import db from '../db/db';

// Extend Express Request to include custom fields
declare module 'express-serve-static-core' {
  interface Request {
    accessToken?: string | null;
  }
}

/**
 * CREATE SESSION TOKEN
 * Creates a JWT session token for the user, which can be used to authenticate requests
 * @param user
 * @returns
 */
const createSessionToken = (user: any) => {
  // Get the Webflow secret from environment variables
  const secret = process.env.WEBFLOW_CLIENT_SECRET;
  if (!secret) {
    throw new Error('WEBFLOW_CLIENT_SECRET is not defined in environment');
  }
  const sessionToken = jwt.sign({ user }, secret, {
    expiresIn: '24h',
  });
  const decodedToken = jwt.decode(sessionToken) as JwtPayload | null;
  return {
    sessionToken,
    exp: decodedToken?.exp,
  };
};

/**
 * RETRIEVE ACCESS TOKEN
 * Given a site ID, retrieve associated Access Token
 * @param req
 * @param res
 * @param next
 * @returns
 */
const retrieveAccessToken: RequestHandler = (req, res, next) => {
  console.log('Retrieving access token for site ID:', req.body.siteId);
  const idToken = req.body.idToken;
  const siteId = req.body.siteId;

  if (!idToken) {
    res.status(401).json({ message: 'ID Token is missing' });
    return;
  }
  if (!siteId) {
    res.status(401).json({ message: 'Site ID is missing' });
    return;
  }

  db.getAccessTokenFromSiteId(
    siteId,
    (error: Error | null, accessToken: string | null) => {
      if (error) {
        return res
          .status(500)
          .json({ error: 'Failed to retrieve access token' });
      }
      // Attach access token in the request object so that you can make an authenticated request to Webflow
      req.accessToken = accessToken;

      next(); // Proceed to next middleware or route handler
    }
  );
};

/**
 * Middleware to authenticate and validate JWT, and fetch the access token given the user ID
 * @param req
 * @param res
 * @param next
 * @returns
 */
const authenticateSessionToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const sessionToken = authHeader && authHeader.split(' ')[1]; // Extract the token from 'Bearer <token>'
  if (!sessionToken) {
    res.status(401).json({ message: 'Authentication token is missing' });
    return;
  }

  // Get the Webflow Secret
  const secret = process.env.WEBFLOW_CLIENT_SECRET;
  if (!secret) {
    throw new Error('WEBFLOW_CLIENT_SECRET is not defined in environment');
  }

  // Verify the Token
  jwt.verify(sessionToken, secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }

    // Get the user from the decoded token
    const user = (decoded as JwtPayload).user;

    console.log('Authenticated user:', user);

    // Use the user details to fetch the access token from the database
    db.getAccessTokenFromUserId(user.id, (error, accessToken) => {
      if (error) {
        return res
          .status(500)
          .json({ error: 'Failed to retrieve access token' });
      }
      // Attach access token in the request object so that you can make an authenticated request to Webflow
      req.accessToken = accessToken;

      next(); // Proceed to next middleware or route handler
    });
  });
};

export default {
  createSessionToken,
  retrieveAccessToken,
  authenticateSessionToken,
};
