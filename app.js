const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const cors = require('cors');

const dotenv = require('dotenv').config();
const userRoute = require('./routes/users');
// Setting the middlewares...
app.use(cors());
app.use(express.json());
// Setting up the route
app.use('/api/v1/', userRoute);

// var ONLINE_USERS = [];
// // Socket Connection
// io.on('connection', socket=>{

//     socket.on("USER_JOIN", username=>{
//         socket.join(username);
//         const notification = `${username} is now ONLINE`;
     
//         ONLINE_USERS.push(username);
//         console.log(`${username} Joined the chat.`);

//         io.emit("TEST", `${username} just joined the chat.`)
//     });

//     socket.on("CLIENT_MESSAGE", msg=>{
//         const content = msg.content;
//         const date = msg.date;
//         const receiver = msg.receiver;
//         const msg2 = {
//             content,
//             sender: "You",
//             date,
//             receiver
//         }
        
//         // socket.join(receiver);
        
//         socket.emit("SERVER_MESSAGE", msg);
//         socket.broadcast.to(receiver).emit("SERVER_MESSAGE", msg);
//     });

//     socket.on('disconnect', ()=>{
//         console.log('A user left')
//     })
// })

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>console.log(`Server running on PORT: ${PORT}`))