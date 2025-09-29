import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllLawyers,
  getLawyerById,
  createLawyer,
  updateLawyer,
  deleteLawyer
} from '../controllers/lawyerController.js';

const router = express.Router();

// Public routes
router.get('/lawyers', getAllLawyers);
router.get('/lawyers/:id', getLawyerById);

// Protected admin routes
router.post('/admin/lawyers', authMiddleware, createLawyer);
router.put('/admin/lawyers/:id', authMiddleware, updateLawyer);
router.delete('/admin/lawyers/:id', authMiddleware, deleteLawyer);

export default router;