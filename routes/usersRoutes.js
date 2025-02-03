const express = require("express");
const { register, login } = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", authMiddleware(["manager"]), async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "دسترسی غیرمجاز" });
    }

    const users = await User.find({ role: "user" }).select("_id username");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "خطا در دریافت کاربران", error: err });
  }
});

module.exports = router;
