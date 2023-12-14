import { Server } from "socket.io";
const io = new Server(8000, {
  cors: true,
});

const emailToSocket = new Map();
const socketToEmail = new Map();
console.log("Socket server listening on port 8000");

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (data) => {
    const { roomNO, Email } = data;
    emailToSocket.set(data.email, socket.id);
    socketToEmail.set(socket.id, data.email);
    console.log(`User ${data.email} joined room ${roomNO}`);
    io.to(roomNO).emit("user-joined", { Email, id: socket.id });
    socket.join(roomNO);
    io.to(socket.id).emit("join-room", data);
    console.log(`User ${data.email} joined room and notified`);
  });

  socket.on("user-call", ({ to, offer }) => {
    console.log(`User ${socket.id} initiated a call to ${to}`);
    io.to(to).emit("incoming-call", { from: socket.id, offer });
    console.log(`Sent incoming-call to ${to}`);
  });

  socket.on("call-accepted", ({ to, answer }) => {
    console.log(`User ${socket.id} accepted the call from ${to}`);
    io.to(to).emit("call-accepted", { from: socket.id, answer });
    console.log(`Sent call-accepted to ${to}`);
  });

  // Additional event listeners can be added here with logging

  socket.on("disconnect", () => {
    const userEmail = socketToEmail.get(socket.id);
    if (userEmail) {
      console.log(`User ${userEmail} disconnected`);
      emailToSocket.delete(userEmail);
      socketToEmail.delete(socket.id);
    }
  });
});
