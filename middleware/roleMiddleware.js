import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

export const allowModules = (modules) => (req, res, next) => {
  const user = req.user;
  if (user.role === "subadmin") {
    const allowed = user.assignedTo.some((m) => modules.includes(m));
    if (!allowed)
      return res.status(403).json({ error: "Access denied to this module" });
  }
  next();
};
