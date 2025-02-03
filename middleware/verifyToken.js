const jwt = require("jsonwebtoken");

// میدلور برای تایید توکن JWT
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // تأیید و استخراج اطلاعات از توکن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // ذخیره شناسه کاربر در درخواست
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
