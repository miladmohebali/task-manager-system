const User = require("../models/User");

exports.getUserScores = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }, "username points").sort({
      points: -1,
    }); // مرتب‌سازی براساس امتیاز
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user scores", error: err });
  }
};
