import { prisma } from '../server.js';

/**
 * Create News (Admin only)
 */
export const createNews = async (req, res) => {
  try {
    const { title, link, description } = req.body;
    let imageUrl = req.body.imageUrl;

    // If file uploaded, set imageUrl
    if (req.file) {
      imageUrl = `/upload/${req.file.filename}`;
    }

    // Validate required fields
    if (!title || !link || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, link, and description are required.'
      });
    }

    const news = await prisma.news.create({
      data: { title, link, description, imageUrl }
    });

    res.status(201).json({
      success: true,
      message: 'News created successfully.',
      data: news
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create news.'
    });
  }
};

/**
 * Get All News (Public)
 */
export const getAllNews = async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: news,
      count: news.length
    });
  } catch (error) {
    console.error('Get all news error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news.'
    });
  }
};

/**
 * Get News by ID (Public)
 */
export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await prisma.news.findUnique({
      where: { id }
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Get news by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news.'
    });
  }
};

/**
 * Update News (Admin only)
 */
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, description } = req.body;
    let imageUrl = req.body.imageUrl;

    // If new image uploaded, update URL
    if (req.file) {
      imageUrl = `/upload/${req.file.filename}`;
    }

    // Check if news exists
    const existingNews = await prisma.news.findUnique({
      where: { id }
    });

    if (!existingNews) {
      return res.status(404).json({
        success: false,
        message: 'News not found.'
      });
    }

    const news = await prisma.news.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(link && { link }),
        ...(description && { description }),
        ...(imageUrl !== undefined && { imageUrl })
      }
    });

    res.status(200).json({
      success: true,
      message: 'News updated successfully.',
      data: news
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update news.'
    });
  }
};

/**
 * Delete News (Admin only)
 */
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const existingNews = await prisma.news.findUnique({
      where: { id }
    });

    if (!existingNews) {
      return res.status(404).json({
        success: false,
        message: 'News not found.'
      });
    }

    await prisma.news.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'News deleted successfully.'
    });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete news.'
    });
  }
};
