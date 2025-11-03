import express from 'express';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';

const router = express.Router();

// ✅ Multer storage config for service images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'upload')); // Folder: /upload
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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

// ✅ Public routes
router.get('/services', getAllServices);
router.get('/services/:slug', getServiceBySlug);

// ✅ Protected admin routes with image upload
router.post('/admin/services', authMiddleware, upload.single('image'), createService);
router.put('/admin/services/:id', authMiddleware, upload.single('image'), updateService);
router.delete('/admin/services/:id', authMiddleware, deleteService);

// subamin routes
router.post('/subadmin/services', roleMiddleware, upload.single('image'), createService);
router.put('/subadmin/services/:id', roleMiddleware, upload.single('image'), updateService);
router.delete('/subadmin/services/:id', roleMiddleware, deleteService);

export default router;
