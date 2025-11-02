import express from "express";
import { prisma } from "../server.js"; // Import Prisma client
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 GET — Fetch site settings (for all users)
router.get("/", async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findFirst();
    res.json(settings);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 PUT — Update site settings (only admin should do this)
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { showTeam, showNews, showServices, showBlog } = req.body;

    const existingSettings = await prisma.siteSettings.findFirst();

    let updated;
    if (existingSettings) {
      // Update the existing settings
      updated = await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: {
          showTeam,
          showNews,
          showServices,
          showBlog,
        },
      });
    } else {
      // Create settings if they don’t exist
      updated = await prisma.siteSettings.create({
        data: {
          showTeam: showTeam ?? true,
          showNews: showNews ?? true,
          showServices: showServices ?? true,
          showBlog: showBlog ?? true,
        },
      });
    }

    res.json({ success: true, message: "Settings updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating site settings:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
