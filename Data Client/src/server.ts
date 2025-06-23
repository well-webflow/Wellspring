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
import tokenRoutes from './routes/tokenRoutes';

// Configure the Express server
const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Set up CORS Middleware
app.use(
  cors({
    origin: '*',
  })
);

// app.use(
//   cors({
//     origin: [
//       'http://localhost:1337',
//       'https://striking-illegally-wallaby.ngrok-free.app',
//     ],
//   })
// );

// Set up JSON body parser middleware
app.use(express.json());

// Sample Routes
app.post('/hello', (req, res) => {
  console.log('Received request on /hello');
  res.send('Hello World!');
});

// Setup Routes
app.use('/sites', sitesRoutes);
app.use('/auth', authRoutes);
app.use('/token', tokenRoutes);

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
