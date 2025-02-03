const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/taskmanager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log(`MongoDB connection error: ${err}`);
});

module.exports = mongoose;
