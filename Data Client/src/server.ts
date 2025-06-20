import express from 'express';
import cors from 'cors';

// Load environment variables from .env file
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// NGROK for hosting locally
import { startNgrok } from './utils/ngrokManager';
import { logServerInfo } from './utils/serverLog';

// Middleware
// import webflowClientMiddleware from './middleware/webflowClientMiddleware';

// Import routes
import sitesRoutes from './routes/sitesRoutes';
import authRoutes from './routes/authRoutes';
import { getAccessTokenBySiteId, insertSiteAuthorization } from './db/db';

// Configure the Express server
const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Set up CORS Middleware
app.use(
  cors({
    origin: [
      'http://localhost:1337',
      'https://striking-illegally-wallaby.ngrok-free.app',
    ],
  })
);

// Set up JSON body parser middleware
app.use(express.json());

// Sample Route
app.post('/hello', (req, res) => {
  res.send('Hello World!');
});

app.get('/db', async (req, res) => {
  await insertSiteAuthorization('sample-site-id', 'sample-access-token');
  res.send('Database initialized');
});

app.post('/db/site', async (req, res) => {
  const { siteId } = req.body;
  const token = await getAccessTokenBySiteId(siteId);
  res.send('Access Token: ' + token);
});

// Setup Routes
app.use('/sites', sitesRoutes);
app.use('/auth', authRoutes);

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
