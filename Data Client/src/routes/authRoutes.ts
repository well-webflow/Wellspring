import express from 'express';
import { authCallback, authorizeWebflow } from '../handlers/authHandler';

const router = express.Router();

router.get('/', authorizeWebflow);
router.get('/callback', authCallback);

export default router;
