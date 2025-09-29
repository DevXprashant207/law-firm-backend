import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postController.js';

const router = express.Router();

// Public routes
router.get('/posts', getAllPosts);
router.get('/posts/:slug', getPostBySlug);

// Protected admin routes
router.post('/admin/posts', authMiddleware, createPost);
router.put('/admin/posts/:id', authMiddleware, updatePost);
router.delete('/admin/posts/:id', authMiddleware, deletePost);

export default router;