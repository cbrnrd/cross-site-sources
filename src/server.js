import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectDB from './db.js';
import authRouter from './routes/auth.js';
import articlesRouter from './routes/articles.js';
import userRouter from './routes/user.js';
import cookieParser from 'cookie-parser';
import startDailyAggregator from './dailyaggregator.js';

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  credentials: true,
  origin: process.env.ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());
app.use(cookieParser());


// Routes
app.use('/api/auth', authRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 5000;

// Start automatic aggregator
startDailyAggregator({hours: .25});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
