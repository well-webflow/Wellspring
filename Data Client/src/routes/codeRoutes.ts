import express from 'express';
import jwt from '../utils/jwt';

const router = express.Router();

router.get('/register', jwt.authenticateSessionToken, async (req, res) => {
  console.log('Received request on /custom-code/register');
  res.json({ dice: 'hello' });
});

export default router;
