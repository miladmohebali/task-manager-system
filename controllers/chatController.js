const ChatRequest = require("../models/ChatRequest");
const Message = require("../models/Message");

// ارسال درخواست چت
exports.sendChatRequest = async (req, res) => {
  const { managerId } = req.body;

  if (req.user.role !== "user") {
    return res
      .status(403)
      .json({ message: "Only users can send chat requests." });
  }

  try {
    const chatRequest = await ChatRequest.create({
      user: req.user.id,
      manager: managerId,
    });
    res.status(201).json(chatRequest);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating chat request", error: err });
  }
};

// تأیید یا رد درخواست چت
exports.updateChatRequest = async (req, res) => {
  const { status } = req.body;

  if (req.user.role !== "manager") {
    return res
      .status(403)
      .json({ message: "Only managers can approve or reject chat requests." });
  }

  try {
    const chatRequest = await ChatRequest.findById(req.params.id);

    if (!chatRequest || chatRequest.manager.toString() !== req.user.id) {
      return res.status(404).json({ message: "Chat request not found." });
    }

    chatRequest.status = status;
    await chatRequest.save();

    res.json(chatRequest);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating chat request", error: err });
  }
};

// ارسال پیام
exports.sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  try {
    const chatRequest = await ChatRequest.findById(chatId);

    if (!chatRequest || chatRequest.status !== "approved") {
      return res
        .status(403)
        .json({ message: "Chat not approved or not found." });
    }

    if (
      ![chatRequest.user.toString(), chatRequest.manager.toString()].includes(
        req.user.id
      )
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to send messages in this chat." });
    }

    const message = await Message.create({
      chatId,
      sender: req.user.id,
      content,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Error sending message", error: err });
  }
};

// دریافت پیام‌ها
exports.getMessages = async (req, res) => {
  try {
    const chatRequest = await ChatRequest.findById(req.params.chatId);

    if (!chatRequest || chatRequest.status !== "approved") {
      return res
        .status(403)
        .json({ message: "Chat not approved or not found." });
    }

    if (
      ![chatRequest.user.toString(), chatRequest.manager.toString()].includes(
        req.user.id
      )
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view messages in this chat." });
    }

    const messages = await Message.find({ chatId: req.params.chatId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err });
  }
};
