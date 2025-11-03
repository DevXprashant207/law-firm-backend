import express from 'express';
import multer from 'multer';
import path from 'path';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postController.js';

const router = express.Router();

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'upload')); // Folder to save images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  }
});

// ✅ Public routes
router.get('/posts', getAllPosts);
router.get('/posts/:slug', getPostBySlug);

// ✅ Protected admin routes (with image upload)
router.post('/admin/posts', authMiddleware, upload.single('image'), createPost);
router.put('/admin/posts/:id', authMiddleware, upload.single('image'), updatePost);
router.delete('/admin/posts/:id', authMiddleware, deletePost);

// subamin routes
router.post('/subadmin/posts', roleMiddleware, upload.single('image'), createPost);
router.put('/subadmin/posts/:id', roleMiddleware, upload.single('image'), updatePost);
router.delete('/subadmin/posts/:id', roleMiddleware, deletePost);

export default router;
