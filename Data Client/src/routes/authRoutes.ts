import express from 'express';
import jwt from '../utils/jwt';
import {
  authCallback,
  authorizeWebflow,
  validateToken,
} from '../handlers/authHandler';

const router = express.Router();

router.get('/', authorizeWebflow);
router.get('/callback', authCallback);
router.post('/token', jwt.retrieveAccessToken, validateToken);

export default router;
