import { prisma } from '../server.js';

/**
 * Get all posts (Public)
 */
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.post.count()
    ]);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts.'
    });
  }
};

/**
 * Get post by slug (Public)
 */
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await prisma.post.findUnique({ where: { slug } });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    res.status(200).json({ success: true, data: post });

  } catch (error) {
    console.error('Get post by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post.'
    });
  }
};

/**
 * Create new post (Admin only)
 */
export const createPost = async (req, res) => {
  try {
    const { title, slug, content } = req.body;
    let imageUrl = req.body.imageUrl;

    // ✅ If file uploaded, set imageUrl
    if (req.file) {
      imageUrl = `/upload/${req.file.filename}`;
    }

    // Validate required fields
    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, slug, and content are required.'
      });
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: 'A post with this slug already exists.'
      });
    }

    // Create post
    const post = await prisma.post.create({
      data: { title, slug, content, imageUrl }
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully.',
      data: post
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post.'
    });
  }
};

/**
 * Update post (Admin only)
 */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = `/upload/${req.file.filename}`;
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    // Check for slug conflict
    if (slug && slug !== existingPost.slug) {
      const slugConflict = await prisma.post.findUnique({ where: { slug } });
      if (slugConflict) {
        return res.status(400).json({
          success: false,
          message: 'A post with this slug already exists.'
        });
      }
    }

    // Update post
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(content && { content }),
        ...(imageUrl && { imageUrl })
      }
    });

    res.status(200).json({
      success: true,
      message: 'Post updated successfully.',
      data: post
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post.'
    });
  }
};

/**
 * Delete post (Admin only)
 */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const existingPost = await prisma.post.findUnique({ where: { id } });

    if (!existingPost) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    await prisma.post.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Post deleted successfully.' });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post.'
    });
  }
};
