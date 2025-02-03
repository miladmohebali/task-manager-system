const multer = require("multer");
const path = require("path");

// تنظیم مکان ذخیره فایل‌ها و نام‌گذاری آنها
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // پوشه‌ای که فایل‌ها در آن ذخیره می‌شوند
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // نام فایل با یک شناسه یکتا
  },
});

// فیلتر نوع فایل
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // محدودیت حجم فایل (5MB)
});

module.exports = upload;
