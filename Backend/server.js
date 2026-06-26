const dotenv = require("dotenv");
const app = require("./src/app");
const connectToDb = require("./src/config/database");

const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

connectToDb();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// 🔥 STORE ONLINE USERS
const users = {};

// ================= SOCKET =================
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ================= JOIN =================
  socket.on("join", (userId) => {
    users[userId] = socket.id;

    // join personal room
    socket.join(userId);

    console.log("User joined:", userId);

    // send online users to everyone
    io.emit("onlineUsers", Object.keys(users));
  });

  // ================= SEND MESSAGE =================
  socket.on("sendMessage", (data) => {
    io.to(data.receiver).emit("receiveMessage", data);
  });

  // ================= TYPING =================
  socket.on("typing", ({ receiver }) => {
    socket.to(receiver).emit("typing");
  });

  // ================= STOP TYPING =================
  socket.on("stopTyping", ({ receiver }) => {
    socket.to(receiver).emit("stopTyping");
  });

  // ================= DISCONNECT =================
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // remove disconnected user
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
      }
    }

    // update everyone
    io.emit("onlineUsers", Object.keys(users));
  });
});

// ================= START SERVER =================
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});