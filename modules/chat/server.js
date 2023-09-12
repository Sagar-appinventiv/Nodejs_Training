// import express from 'express';
// import http from 'http';
// import socketIO from 'socket.io';

// const app = express();
// const server = http.createServer(app);
// const io = new socketIO.Server(server);

// // Store user sockets
// const userSockets: Record<string, socketIO.Socket> = {};

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // Listen for a user joining the chat
//   socket.on('join', (userId: string) => {
//     userSockets[userId] = socket;
//     console.log(`User ${userId} joined the chat`);
//   });

//   // Listen for a message
//   socket.on('message', (data: { from: string; to: string; message: string }) => {
//     const { to, message } = data;
//     const recipientSocket = userSockets[to];
//     if (recipientSocket) {
//       recipientSocket.emit('message', { from: data.from, message });
//     }
//   });

//   // Listen for user disconnection
//   socket.on('disconnect', () => {
//     for (const userId in userSockets) {
//       if (userSockets[userId] === socket) {
//         delete userSockets[userId];
//         console.log(`User ${userId} disconnected`);
//         break;
//       }
//     }
//   });
// });

// server.listen(3000, () => {
//   console.log('Server listening on port 3000');
// });

const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = 4050

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})