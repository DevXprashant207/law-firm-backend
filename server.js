import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import subAdminRoutes from "./routes/subAdminRoutes.js";



// Import routes
import siteSettingsRoutes from './routes/siteSettingsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import lawyerRoutes from './routes/lawyerRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import postRoutes from './routes/postRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Middleware
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
//   credentials: true
// }));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve upload folder statically
import path from 'path';
app.use('/upload', express.static(path.join(process.cwd(), 'upload')));

// Site settings routes

app.use('/api/settings', siteSettingsRoutes);
app.use("/api/subadmin", subAdminRoutes);
// Routes
app.use('/api/admin/auth', authRoutes);
app.use('/api', lawyerRoutes);
app.use('/api', serviceRoutes);
app.use('/api', postRoutes);
app.use('/api', mediaRoutes);
app.use('/api', enquiryRoutes);
app.use('/api', newsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Law Firm API is running',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Law Firm API server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});