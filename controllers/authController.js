import jwt from 'jsonwebtoken';
import { prisma } from '../server.js';

/**
 * Admin login controller
 * Authenticates admin and returns JWT token
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Compare password directly (plain text)
    if (password !== admin.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h',
        issuer: 'law-firm-api'
      }
    );
    console.log(token);
    // Return success response with token
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      data: {
        admin: {
          id: admin.id,
          email: admin.email
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
};
