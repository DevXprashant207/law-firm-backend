import { prisma } from '../server.js';

/**
 * Get all services (Public)
 */
export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        lawyers: {
          include: {
            lawyer: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Transform the response to include lawyers directly
    const transformedServices = services.map(service => ({
      ...service,
      lawyers: service.lawyers.map(ls => ls.lawyer)
    }));

    res.status(200).json({
      success: true,
      data: transformedServices,
      count: transformedServices.length
    });

  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services.'
    });
  }
};

/**
 * Get service by slug with associated lawyers (Public)
 */
export const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        lawyers: {
          include: {
            lawyer: true
          }
        }
      }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.'
      });
    }

    // Transform the response to include lawyers directly
    const transformedService = {
      ...service,
      lawyers: service.lawyers.map(ls => ls.lawyer)
    };

    res.status(200).json({
      success: true,
      data: transformedService
    });

  } catch (error) {
    console.error('Get service by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service.'
    });
  }
};

/**
 * Create new service (Admin only)
 */
export const createService = async (req, res) => {
  try {
    const { name, slug, description, lawyerIds } = req.body;

    // Validate required fields
    if (!name || !slug || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, slug, and description are required.'
      });
    }

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug }
    });

    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'A service with this slug already exists.'
      });
    }

    // Create service with optional lawyer associations
    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        ...(lawyerIds && lawyerIds.length > 0 && {
          lawyers: {
            create: lawyerIds.map(lawyerId => ({
              lawyer: {
                connect: { id: lawyerId }
              }
            }))
          }
        })
      },
      include: {
        lawyers: {
          include: {
            lawyer: true
          }
        }
      }
    });

    // Transform response
    const transformedService = {
      ...service,
      lawyers: service.lawyers.map(ls => ls.lawyer)
    };

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: transformedService
    });

  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service.'
    });
  }
};

/**
 * Update service and handle lawyer associations (Admin only)
 */
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, lawyerIds } = req.body;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.'
      });
    }

    // If slug is being updated, check for conflicts
    if (slug && slug !== existingService.slug) {
      const slugConflict = await prisma.service.findUnique({
        where: { slug }
      });

      if (slugConflict) {
        return res.status(400).json({
          success: false,
          message: 'A service with this slug already exists.'
        });
      }
    }

    // Update service
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(lawyerIds !== undefined && {
          lawyers: {
            deleteMany: {}, // Remove all existing associations
            ...(lawyerIds.length > 0 && {
              create: lawyerIds.map(lawyerId => ({
                lawyer: {
                  connect: { id: lawyerId }
                }
              }))
            })
          }
        })
      },
      include: {
        lawyers: {
          include: {
            lawyer: true
          }
        }
      }
    });

    // Transform response
    const transformedService = {
      ...service,
      lawyers: service.lawyers.map(ls => ls.lawyer)
    };

    res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      data: transformedService
    });

  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service.'
    });
  }
};

/**
 * Delete service (Admin only)
 */
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.'
      });
    }

    // Delete service (cascade will handle LawyerService relationships)
    await prisma.service.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully.'
    });

  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service.'
    });
  }
};