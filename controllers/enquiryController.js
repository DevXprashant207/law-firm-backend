import { prisma } from '../server.js';

/**
 * Create new enquiry (Public)
 */
export const createEnquiry = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message, lawId, imageUrl } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !message || !lawId) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, phone, message, and lawId are required.'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Create enquiry
    const enquiry = await prisma.enquiry.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        message: message.trim(),
        lawId: lawId,
        imageUrl: imageUrl || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your enquiry. We will get back to you soon.',
      data: {
        id: enquiry.id,
        firstName: enquiry.firstName,
        lastName: enquiry.lastName,
        email: enquiry.email,
        phone: enquiry.phone,
        message: enquiry.message,
        lawId: enquiry.lawId,
        imageUrl: enquiry.imageUrl,
        createdAt: enquiry.createdAt
      }
    });

  } catch (error) {
    console.error('Create enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry. Please try again.'
    });
  }
};

/**
 * Get all enquiries (Admin only)
 */
export const getAllEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Validate sort parameters
    const validSortFields = ['createdAt', 'firstName', 'email'];
    const validSortOrders = ['asc', 'desc'];

    const orderBy = {};
    orderBy[validSortFields.includes(sortBy) ? sortBy : 'createdAt'] =
      validSortOrders.includes(sortOrder) ? sortOrder : 'desc';

    const [enquiries, totalCount] = await Promise.all([
      prisma.enquiry.findMany({
        skip,
        take: parseInt(limit),
        orderBy
      }),
      prisma.enquiry.count()
    ]);

    res.status(200).json({
      success: true,
      data: enquiries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get all enquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries.'
    });
  }
};

/**
 * Delete enquiry (Admin only)
 */
export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if enquiry exists
    const existingEnquiry = await prisma.enquiry.findUnique({
      where: { id }
    });

    if (!existingEnquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.'
      });
    }

    // Delete enquiry
    await prisma.enquiry.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully.'
    });

  } catch (error) {
    console.error('Delete enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete enquiry.'
    });
  }
};
