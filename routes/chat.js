const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ChatRequest = require("../models/ChatRequest");
const Message = require("../models/Message");
const chatController = require("../controllers/chatController");

router.post("/requests", auth(["user"]), chatController.sendChatRequest);

router.patch(
  "/requests/:id",
  auth(["manager"]),
  chatController.updateChatRequest
);

router.post("/messages", auth(["user", "manager"]), chatController.sendMessage);

router.get(
  "/messages/:chatId",
  auth(["user", "manager"]),
  chatController.getMessages
);

module.exports = router;
