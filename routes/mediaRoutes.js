import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllMedia,
  createMedia,
  updateMedia,
  deleteMedia
} from '../controllers/mediaController.js';

const router = express.Router();

// Public route
router.get('/media', getAllMedia);

// Protected admin routes
router.post('/admin/media', authMiddleware, createMedia);
router.put('/admin/media/:id', authMiddleware, updateMedia);
router.delete('/admin/media/:id', authMiddleware, deleteMedia);

export default router;