const Task = require("../models/Task");
const path = require("path");
const fs = require("fs");

// آپلود فایل برای تسک
exports.uploadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = req.file.path;

    const task = await Task.findByIdAndUpdate(
      id,
      { file: filePath },
      { new: true }
    );

    if (!task) {
      fs.unlinkSync(filePath); // حذف فایل اگر تسک پیدا نشد
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "File uploaded successfully", task });
  } catch (err) {
    res.status(500).json({ message: "Error uploading file", error: err });
  }
};

// دانلود فایل
exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task || !task.file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(path.resolve(task.file)); // ارسال فایل برای دانلود
  } catch (err) {
    res.status(500).json({ message: "Error downloading file", error: err });
  }
};
