import express from 'express';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import {
  getAllLawyers,
  getLawyerById,
  createLawyer,
  updateLawyer,
  deleteLawyer
} from '../controllers/lawyerController.js';

const router = express.Router();

// Multer storage config for lawyer images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'upload'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Public routes
router.get('/lawyers', getAllLawyers);
router.get('/lawyers/:id', getLawyerById);

// Protected admin routes with image upload
router.post('/admin/lawyers', authMiddleware, upload.single('image'), createLawyer);
router.put('/admin/lawyers/:id', authMiddleware, upload.single('image'), updateLawyer);
router.delete('/admin/lawyers/:id', authMiddleware, deleteLawyer);

// subamin routes
router.post('/subadmin/lawyers', roleMiddleware, upload.single('image'), createLawyer);
router.put('/subadmin/lawyers/:id', roleMiddleware, upload.single('image'), updateLawyer);
router.delete('/subadmin/lawyers/:id', roleMiddleware, deleteLawyer);

export default router;