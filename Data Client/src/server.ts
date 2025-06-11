import express from 'express';
import dotenv from 'dotenv';

// NGROK for hosting locally
import { startNgrok } from './utils/ngrokManager';
import { logServerInfo } from './utils/serverLog';

// Middleware
// import webflowClientMiddleware from './middleware/webflowClientMiddleware';

// Import routes
import sitesRoutes from './routes/sitesRoutes';

// Configure the Express server
dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.post('/dice', (req, res) => {
  const randomDice = Math.floor(Math.random() * 7) + 1;
  res.json({ dice: randomDice });
});

// Setup Routes
app.use('/sites', sitesRoutes);

// Start server with NGROK
const startServer = async () => {
  try {
    const ngrokUrl = await startNgrok(PORT);
    logServerInfo(ngrokUrl, PORT);
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server with ngrok:', error);
    process.exit(1);
  }
};

startServer();
