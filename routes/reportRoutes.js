const express = require("express");
const { getTasksSummary } = require("../controllers/reportController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/tasks-summary", auth(["manager"]), getTasksSummary);

module.exports = router;
