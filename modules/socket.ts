// import { Server } from 'socket.io';
// import { Like } from './src/models/like.model'; // Import the Like model

// export const initializeSocket = (server:any) => {
//     const io = new Server(server);

//     io.on('connection',  (socket) => {
//         console.log(`User connected: ${socket.id}`);

//         socket.on('joinRoom',  (roomId) => {
//             const [user1Id, user2Id] = roomId.split('_').slice(1);
//             const areUsersMatched =  Like.isMatch(user1Id, user2Id);

//             if (areUsersMatched) {
//                 socket.join(roomId);
//                 console.log(`User ${socket.id} joined room ${roomId}`);
//             } else {
//                 console.log(`User ${socket.id} is not allowed to join room ${roomId}`);
//             }
//         });

//         socket.on('privateMessage', ({ roomId, message }) => {
//             io.to(roomId).emit('privateMessage', {
//                 sender: socket.id,
//                 message: message,
//             });
//             console.log(`Private message sent in room ${roomId}: ${message}`);
//         });

//         socket.on('privateChat',  ({ userId1, userId2 }) => {
//             const areUsersMatched =  Like.isMatch(userId1, userId2);

//             if (areUsersMatched) {
//                 const roomId = `room_${userId1}_${userId2}`;
//                 socket.join(roomId);
//                 console.log(`User ${socket.id} started a private chat with ${userId2}`);
//             } else {
//                 console.log(`User ${socket.id} is not allowed to start a chat with ${userId2}`);
//             }
//         });

//         socket.on('disconnect', () => {
//             console.log(`User disconnected: ${socket.id}`);
//         });
//     });
// };
