import express from "express";
import {
  createSubAdmin,
  loginSubAdmin,
  getAllSubAdmins,
  deleteSubAdmin,
  updateSubAdminRoles,
  getSubAdminProfile,
} from "../controllers/subAdminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
const router = express.Router();

// ✅ SuperAdmin-only routes
router.post("/create",  authMiddleware, createSubAdmin);       // Create a new subadmin
router.get("/",  authMiddleware, getAllSubAdmins);             // List all subadmins
router.delete("/:id",  authMiddleware, deleteSubAdmin);        // Delete subadmin by ID
router.put("/:id",  authMiddleware, updateSubAdminRoles); // Update subadmin roles
// ✅ New route
router.get("/me", roleMiddleware, getSubAdminProfile);
// ✅ SubAdmin login route (no token required)
router.post("/login", loginSubAdmin);

export default router;
