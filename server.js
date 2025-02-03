const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("./config/db");
const userRoutes = require("./routes/usersRoutes");
const taskRoutes = require("./routes/tasksRoutes");
const userRoute = require("./routes/user");
const chatRoutes = require("./routes/chat");
const reportRoutes = require("./routes/reportRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const fileRoutes = require("./routes/fileRoutes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// استفاده از روتر‌ها
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/files", fileRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("sendMessage", ({ chatId, sender, content }) => {
    io.to(chatId).emit("receiveMessage", { sender, content });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// اجرای سرور
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
