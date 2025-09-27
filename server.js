// server.js
import 'dotenv/config';
// import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import connectDB from './src/config/db.js';
import errorHandler from './src/middleware/errorHandler.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import supplierRoutes from './src/routes/supplierRoutes.js';
import transactionRoutes from './src/routes/transactionRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// connect to MongoDB
connectDB();

// global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// health check
app.get('/api/v1/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/reports', reportRoutes);

// global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
