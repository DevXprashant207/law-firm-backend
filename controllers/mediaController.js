import { prisma } from '../server.js';

/**
 * Get all media coverage (Public)
 */
export const getAllMedia = async (req, res) => {
  try {
    const media = await prisma.mediaCoverage.findMany({
      orderBy: {
        title: 'asc'
      }
    });

    res.status(200).json({
      success: true,
      data: media,
      count: media.length
    });

  } catch (error) {
    console.error('Get all media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch media coverage.'
    });
  }
};

/**
 * Create new media coverage (Admin only)
 */
export const createMedia = async (req, res) => {
  try {
    const { title, description, link } = req.body;

    // Validate required fields
    if (!title || !description || !link) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and link are required.'
      });
    }

    // Validate URL format
    try {
      new URL(link);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid URL for the link.'
      });
    }

    // Create media coverage
    const media = await prisma.mediaCoverage.create({
      data: {
        title,
        description,
        link
      }
    });

    res.status(201).json({
      success: true,
      message: 'Media coverage created successfully.',
      data: media
    });

  } catch (error) {
    console.error('Create media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create media coverage.'
    });
  }
};

/**
 * Update media coverage (Admin only)
 */
export const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link } = req.body;

    // Check if media exists
    const existingMedia = await prisma.mediaCoverage.findUnique({
      where: { id }
    });

    if (!existingMedia) {
      return res.status(404).json({
        success: false,
        message: 'Media coverage not found.'
      });
    }

    // Validate URL format if link is being updated
    if (link) {
      try {
        new URL(link);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid URL for the link.'
        });
      }
    }

    // Update media coverage
    const media = await prisma.mediaCoverage.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(link && { link })
      }
    });

    res.status(200).json({
      success: true,
      message: 'Media coverage updated successfully.',
      data: media
    });

  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update media coverage.'
    });
  }
};

/**
 * Delete media coverage (Admin only)
 */
export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if media exists
    const existingMedia = await prisma.mediaCoverage.findUnique({
      where: { id }
    });

    if (!existingMedia) {
      return res.status(404).json({
        success: false,
        message: 'Media coverage not found.'
      });
    }

    // Delete media coverage
    await prisma.mediaCoverage.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Media coverage deleted successfully.'
    });

  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete media coverage.'
    });
  }
};