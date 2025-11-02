import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// ✅ Create SubAdmin
export const createSubAdmin = async (req, res) => {
  try {
    const { email, password, name, assignedTo } = req.body;

    if (!email || !password || !assignedTo)
      return res.status(400).json({ error: "Missing required fields" });

    const existing = await prisma.subAdmin.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Subadmin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const subAdmin = await prisma.subAdmin.create({
      data: { email, password: hashed, name, assignedTo },
    });

    res.status(201).json({ success: true, subAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Login SubAdmin
export const loginSubAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const subAdmin = await prisma.subAdmin.findUnique({ where: { email } });
    if (!subAdmin) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, subAdmin.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: subAdmin.id, role: "subadmin", assignedTo: subAdmin.assignedTo },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ List all SubAdmins (only for Superadmin)
export const getAllSubAdmins = async (req, res) => {
  try {
    const subs = await prisma.subAdmin.findMany();
    res.json({ success: true, data: subs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete SubAdmin
export const deleteSubAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.subAdmin.delete({ where: { id } });
    res.json({ success: true, message: "SubAdmin deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
