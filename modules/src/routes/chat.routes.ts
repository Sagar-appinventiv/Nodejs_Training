// // chat.router.ts

// import { ServerRoute } from '@hapi/hapi';
// import path from 'path';

// const chatRoutes: ServerRoute[] = [
//     {
//         method: 'GET',
//         path: '/private-chat',
//         handler: (request, h) => {
//             const filePath = path.join(__dirname, '../private_chat.html');
//             return h.file(filePath);
//         },
//         // options: {
//         //     auth, // If no authentication is required
//         // },
//     },
// ];

// export default chatRoutes;
