const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  assignTask,
} = require("../controllers/taskController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth(["manager"]), createTask);
router.get("/", auth(), getTasks);
router.put("/:id", auth(["manager"]), updateTask);
router.delete("/:id", auth(["manager"]), deleteTask);
router.post("/:id/assign", auth(), assignTask);

module.exports = router;
