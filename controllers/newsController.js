
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create News (Admin only)
export const createNews = async (req, res) => {
  try {
    const { title, link, description, imageUrl } = req.body;
    const news = await prisma.news.create({
      data: { title, link, description, imageUrl }
    });
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All News (Public)
export const getAllNews = async (req, res) => {
  try {
    const news = await prisma.news.findMany({ orderBy: { publishedAt: 'desc' } });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get News by ID (Public)
export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update News (Admin only)
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, description, imageUrl } = req.body;
    const news = await prisma.news.update({
      where: { id },
      data: { title, link, description, imageUrl }
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete News (Admin only)
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.news.delete({ where: { id } });
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
