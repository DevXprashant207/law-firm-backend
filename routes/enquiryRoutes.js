import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
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

router.get('/subadmin/enquiries', roleMiddleware, getAllEnquiries);
router.delete('/subadmin/enquiries/:id', roleMiddleware, deleteEnquiry);
router.patch('/subadmin/enquiries/:id/status',roleMiddleware, updateEnquiryStatus);

export default router;