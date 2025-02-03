const express = require("express");
const { getUserScores } = require("../controllers/scoreController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/scores", auth(["manager"]), getUserScores);

module.exports = router;
