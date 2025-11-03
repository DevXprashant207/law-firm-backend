import jwt from "jsonwebtoken";

export const roleMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save decoded user info (id, email, role, etc.) in request
    req.user = decoded;

    // ✅ Allow both Admin and SubAdmin
    if (decoded.role === "admin" || decoded.role === "subadmin") {
      return next();
    }

    return res.status(403).json({ message: "Forbidden: Admins or SubAdmins only" });

  } catch (error) {
    console.error("Role middleware error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
