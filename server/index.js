import { Server } from "socket.io";
const io = new Server(8000,{
    cors: true,
});

const emailToSocket = new Map();
const socketToEmail = new Map();
console.log("Socket server listening on port 8000");
io.on("connection", (socket) => {
    console.log("a User connected");
    socket.on("join-room",data=>{
    const {roomNO ,Email }=data;
    emailToSocket.set(data.email,socket.id);
    socketToEmail.set(socket.id,data.email);
    console.log(roomNO);
    io.to(roomNO).emit("user-joined",{Email, id: socket.id});
    console.log("user-joined")
    socket.join(roomNO);
    io.to(socket.id).emit("join-room",data);
    console.log("join-room")
    })
});