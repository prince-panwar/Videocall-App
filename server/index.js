import { Server } from "socket.io";
const io = new Server(8000,{
    cors: true,
});

const emailToSocket = new Map();
const socketToEmail = new Map();
console.log("Socket server listening on port 8000");
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("join-room",data=>{
    console.log("join-room server");
    emailToSocket.set(data.email,socket.id);
    socketToEmail.set(socket.id,data.email);
    io.to(socket.id).emit("join-room",data);
    })
});