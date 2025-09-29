import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createEnquiry,
  getAllEnquiries,
  deleteEnquiry
} from '../controllers/enquiryController.js';

const router = express.Router();

// Public route
router.post('/enquiry', createEnquiry);

// Protected admin routes
router.get('/admin/enquiries', authMiddleware, getAllEnquiries);
router.delete('/admin/enquiries/:id', authMiddleware, deleteEnquiry);

export default router;