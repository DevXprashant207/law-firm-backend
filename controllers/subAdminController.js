import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// ✅ Create SubAdmin
export const createSubAdmin = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      canManageEnquiries = false,
      canManageLawyers = false,
      canManageServices = false,
      canManagePosts = false,
      canManageNews = false,
      canManageSettings = false,
    } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Missing required fields" });

    const existing = await prisma.subAdmin.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ error: "SubAdmin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const subAdmin = await prisma.subAdmin.create({
      data: {
        email,
        password: hashed,
        name,
        canManageEnquiries,
        canManageLawyers,
        canManageServices,
        canManagePosts,
        canManageNews,
        canManageSettings,
        createdBy: req.user?.id || "unknown",
      },
    });

    res.status(201).json({ success: true, subAdmin });
  } catch (err) {
    console.error("Error creating SubAdmin:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login SubAdmin
export const loginSubAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const subAdmin = await prisma.subAdmin.findUnique({ where: { email } });
    if (!subAdmin)
      return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, subAdmin.password);
    if (!match)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: subAdmin.id,
        role: "subadmin",
        email: subAdmin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All SubAdmins
export const getAllSubAdmins = async (req, res) => {
  try {
    const subs = await prisma.subAdmin.findMany();
    res.json({ success: true, data: subs });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete SubAdmin
export const deleteSubAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.subAdmin.delete({ where: { id } });
    res.json({ success: true, message: "SubAdmin deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update SubAdmin Roles
export const updateSubAdminRoles = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      canManageEnquiries,
      canManageLawyers,
      canManageServices,
      canManagePosts,
      canManageNews,
      canManageSettings,
    } = req.body;

    const subAdmin = await prisma.subAdmin.findUnique({ where: { id } });
    if (!subAdmin)
      return res.status(404).json({ error: "SubAdmin not found" });

    const updated = await prisma.subAdmin.update({
      where: { id },
      data: {
        canManageEnquiries:
          canManageEnquiries ?? subAdmin.canManageEnquiries,
        canManageLawyers: canManageLawyers ?? subAdmin.canManageLawyers,
        canManageServices: canManageServices ?? subAdmin.canManageServices,
        canManagePosts: canManagePosts ?? subAdmin.canManagePosts,
        canManageNews: canManageNews ?? subAdmin.canManageNews,
        canManageSettings: canManageSettings ?? subAdmin.canManageSettings,
      },
    });

    res.json({
      success: true,
      message: "SubAdmin roles updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Role update error:", err);
    res.status(500).json({ error: err.message });
  }
};
// ✅ Get Logged-in SubAdmin Info (for dashboard)
export const getSubAdminProfile = async (req, res) => {
  try {
    const subAdmin = await prisma.subAdmin.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        canManageEnquiries: true,
        canManageLawyers: true,
        canManageServices: true,
        canManagePosts: true,
        canManageNews: true,
        canManageSettings: true,
      },
    });

    if (!subAdmin) {
      return res.status(404).json({ error: "SubAdmin not found" });
    }

    res.json(subAdmin);
  } catch (err) {
    console.error("Error fetching SubAdmin profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};
