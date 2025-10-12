import express from 'express';
import multer from 'multer';
import path from 'path';
import { createNews, getAllNews, getNewsById, updateNews, deleteNews } from '../controllers/newsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/'); // ensure 'upload' folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ Public routes
router.get('/news', getAllNews);
router.get('/news/:id', getNewsById);

// ✅ Admin routes (with image upload)
router.post('/admin/news', authMiddleware, upload.single('image'), createNews);
router.put('/admin/news/:id', authMiddleware, upload.single('image'), updateNews);
router.delete('/admin/news/:id', authMiddleware, deleteNews);

export default router;
