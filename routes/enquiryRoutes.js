import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createEnquiry,
  getAllEnquiries,
  deleteEnquiry,
  updateEnquiryStatus
} from '../controllers/enquiryController.js';

const router = express.Router();

// Public route
router.post('/enquiry', createEnquiry);

// Protected admin routes

router.get('/admin/enquiries', authMiddleware, getAllEnquiries);
router.delete('/admin/enquiries/:id', authMiddleware, deleteEnquiry);
router.patch('/admin/enquiries/:id/status',authMiddleware, updateEnquiryStatus);

export default router;