const Task = require("../models/Task");
const User = require("../models/User");

exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { status } = req.query; // دریافت وضعیت از کوئری پارامتر

    let query = {};
    if (status) {
      query.status = status; // فیلتر کردن تسک‌ها بر اساس وضعیت
    }

    const tasks = await Task.find(query).populate(
      "assignee",
      "username points"
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "خطا در دریافت تسک‌ها", error: err });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // وضعیت جدید تسک

  try {
    // به‌روزرسانی تسک با مقادیر جدید
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // بررسی وضعیت جدید برای امتیازدهی
    if (status === "completed" && task.assignee) {
      const user = await User.findById(task.assignee);

      if (user) {
        const points = 10; // امتیاز برای تسک تکمیل‌شده
        user.points += points;
        await user.save();

        // (اختیاری) امکان ذخیره فعالیت در مدل دیگری
        // await Activity.create({ user: user._id, task: task._id, points });
      }
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.assignee = req.body.userId;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
