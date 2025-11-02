import express from "express";
import {
  createSubAdmin,
  loginSubAdmin,
  getAllSubAdmins,
  deleteSubAdmin,
} from "../controllers/subAdminController.js";
import { verifyToken } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Superadmin routes
router.post("/create", verifyToken, createSubAdmin);
router.get("/", verifyToken, getAllSubAdmins);
router.delete("/:id", verifyToken, deleteSubAdmin);

// Subadmin login
router.post("/login", loginSubAdmin);

export default router;
