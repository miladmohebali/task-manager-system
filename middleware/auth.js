const jwt = require("jsonwebtoken");

const auth =
  (roles = []) =>
  (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    try {
      const user = jwt.verify(token, "your_secret_key");
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ error: "Access denied" });
      }
      req.user = user;
      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };

module.exports = auth;
