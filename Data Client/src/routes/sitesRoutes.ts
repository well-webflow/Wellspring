import express from 'express';

const router = express.Router();

router.post('/dice', (req, res) => {
  const randomDice = Math.floor(Math.random() * 7) + 1;
  res.json({ dice: randomDice });
});

export default router;
