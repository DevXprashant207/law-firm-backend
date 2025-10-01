import express from 'express';
const router = express.Router();
import { createNews, getAllNews, getNewsById, updateNews, deleteNews } from '../controllers/newsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

// Public routes

// Public routes
router.get('/news/', getAllNews);
router.get('/news/:id', getNewsById);

// Admin routes
router.post('/admin/news/', authMiddleware, createNews);
router.put('/admin/news/:id', authMiddleware, updateNews);
router.delete('/admin/news/:id', authMiddleware, deleteNews);

export default router;
