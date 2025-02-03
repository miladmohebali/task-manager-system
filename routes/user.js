const express = require("express");
const router = express.Router();
const User = require("../models/User"); // مدل کاربر
const verifyToken = require("../middleware/verifyToken"); // میدلور احراز هویت

// روت برای دریافت جزئیات کاربر
router.get("/details", verifyToken, async (req, res) => {
  try {
    // فرض می‌کنیم که اطلاعات کاربر در JWT ذخیره شده است
    const userId = req.userId; // از میدلور verifyToken دریافت می‌شود

    // پیدا کردن کاربر در دیتابیس
    const user = await User.findById(userId).select("-password"); // رمز عبور را از جواب حذف می‌کنیم

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ارسال اطلاعات کاربر
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
