import { prisma } from '../server.js';

/**
 * Get all lawyers (Public)
 */
export const getAllLawyers = async (req, res) => {
  try {
    const lawyers = await prisma.lawyer.findMany({
      include: {
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Transform the response to include services directly
    const transformedLawyers = lawyers.map(lawyer => ({
      ...lawyer,
      services: lawyer.services.map(ls => ls.service)
    }));

    res.status(200).json({
      success: true,
      data: transformedLawyers,
      count: transformedLawyers.length
    });

  } catch (error) {
    console.error('Get all lawyers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lawyers.'
    });
  }
};

/**
 * Get lawyer by ID (Public)
 */
export const getLawyerById = async (req, res) => {
  try {
    const { id } = req.params;

    const lawyer = await prisma.lawyer.findUnique({
      where: { id },
      include: {
        services: {
          include: {
            service: true
          }
        }
      }
    });

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: 'Lawyer not found.'
      });
    }

    // Transform the response to include services directly
    const transformedLawyer = {
      ...lawyer,
      services: lawyer.services.map(ls => ls.service)
    };

    res.status(200).json({
      success: true,
      data: transformedLawyer
    });

  } catch (error) {
    console.error('Get lawyer by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lawyer.'
    });
  }
};

/**
 * Create new lawyer (Admin only)
 */
export const createLawyer = async (req, res) => {
  try {
    const { name, title, bio, serviceIds } = req.body;
    let imageUrl = req.body.imageUrl;

    // If file uploaded, set imageUrl
    if (req.file) {
      imageUrl = `/upload/${req.file.filename}`;
    }

    // Validate required fields
    if (!name || !title || !bio) {
      return res.status(400).json({
        success: false,
        message: 'Name, title, and bio are required.'
      });
    }

    // Create lawyer with optional service associations
    const lawyer = await prisma.lawyer.create({
      data: {
        name,
        title,
        bio,
        imageUrl,
        ...(serviceIds && serviceIds.length > 0 && {
          services: {
            create: serviceIds.map(serviceId => ({
              service: {
                connect: { id: serviceId }
              }
            }))
          }
        })
      },
      include: {
        services: {
          include: {
            service: true
          }
        }
      }
    });

    // Transform response
    const transformedLawyer = {
      ...lawyer,
      services: lawyer.services.map(ls => ls.service)
    };

    res.status(201).json({
      success: true,
      message: 'Lawyer created successfully.',
      data: transformedLawyer
    });

  } catch (error) {
    console.error('Create lawyer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lawyer.'
    });
  }
};

/**
 * Update lawyer (Admin only)
 */
export const updateLawyer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, bio, serviceIds } = req.body;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = `/upload/${req.file.filename}`;
    }

    // Check if lawyer exists
    const existingLawyer = await prisma.lawyer.findUnique({
      where: { id }
    });

    if (!existingLawyer) {
      return res.status(404).json({
        success: false,
        message: 'Lawyer not found.'
      });
    }

    // Update lawyer
    const lawyer = await prisma.lawyer.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(title && { title }),
        ...(bio && { bio }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(serviceIds && {
          services: {
            deleteMany: {}, // Remove all existing associations
            create: serviceIds.map(serviceId => ({
              service: {
                connect: { id: serviceId }
              }
            }))
          }
        })
      },
      include: {
        services: {
          include: {
            service: true
          }
        }
      }
    });

    // Transform response
    const transformedLawyer = {
      ...lawyer,
      services: lawyer.services.map(ls => ls.service)
    };

    res.status(200).json({
      success: true,
      message: 'Lawyer updated successfully.',
      data: transformedLawyer
    });

  } catch (error) {
    console.error('Update lawyer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lawyer.'
    });
  }
};

/**
 * Delete lawyer (Admin only)
 */
export const deleteLawyer = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if lawyer exists
    const existingLawyer = await prisma.lawyer.findUnique({
      where: { id }
    });

    if (!existingLawyer) {
      return res.status(404).json({
        success: false,
        message: 'Lawyer not found.'
      });
    }

    // Delete lawyer (cascade will handle LawyerService relationships)
    await prisma.lawyer.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Lawyer deleted successfully.'
    });

  } catch (error) {
    console.error('Delete lawyer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lawyer.'
    });
  }
};