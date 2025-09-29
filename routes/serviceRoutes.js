import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';

const router = express.Router();

// Public routes
router.get('/services', getAllServices);
router.get('/services/:slug', getServiceBySlug);

// Protected admin routes
router.post('/admin/services', authMiddleware, createService);
router.put('/admin/services/:id', authMiddleware, updateService);
router.delete('/admin/services/:id', authMiddleware, deleteService);

export default router;