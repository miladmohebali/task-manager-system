const express = require("express");
const upload = require("../middleware/fileUpload");
const { uploadFile, downloadFile } = require("../controllers/fileController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post(
  "/:id/upload",
  auth(["manager"]),
  upload.single("file"),
  uploadFile
);
router.get("/:id/download", auth(), downloadFile);

module.exports = router;
