// import redisClient from './redisClient';

// // const client = createClient();
// // client.connect();
// // client.on('error', err => console.log('Redis client error', err));

// export class Redis {
//     static async maintain_session_redis(client, user, device) {
        
//         try {
//             // const client = createClient();
//             // await client.connect();
//             client.on('error', err => console.log('Redis client error', err));
//             if (user) {
//                 await client.SET(user.email, JSON.stringify({ 
//                     'user_id': user.id,
//                     'device_id': device,
//                     'status': true
//                 }));
//                 const redisSession = await client.get(user.email);
//                 console.log(redisSession);
//             }
//             else {
//                 console.log("User not found");
//             }
//         }
//         catch (err) {
//             console.log("Redis not set successfully", err);
//         }
//     }

//     static async logout_session_redis(client, user) {
//         console.log(user.email);
//         try {
//             // console.log(user.username);
//             await client.del(user.email);
//             // const redisSessions = await client.get(user.username);
//             console.log("delete successfully");
//         }
//         catch (err) {
//             console.log("error in deleting", err);
//         }
//     }

//     static async save_otp(email, OTP) {
//         client.on('error', err => console.log('Redis client error', err));
//         try {
//             await client.setEx(email, 300, JSON.stringify({
//                 otp: OTP
//             }));
//             console.log("otp stored successfully");
//         }
//         catch (err) {
//             console.log(err);
//         }
//     }

//     static async get_otp(email) {
//         if (await client.exists(email)) {
//             const otp_details = await client.get(email);
//             const userOTP = JSON.parse(otp_details);
//             return userOTP.otp
//         }
//         else {
//             return false;
//         }
//     }
// }

// export default client;

import redisClient from './redisClient';

export class RedisSession {
    static async maintainSession(user: any, device: any) {
        try {
            if (user) {
                await redisClient.set(user.email, JSON.stringify({
                    'user_id': user.id,
                    'device_id': device,
                    'status': true
                }));
                const redisSession = await redisClient.get(user.email);
                console.log(redisSession);
            } else {
                console.log("User not found");
            }
        } catch (err) {
            console.log("Redis not set successfully", err);
        }
    }

    static async logoutSession(user: any) {
        console.log(user.email);
        try {
            await redisClient.del(user.email);
            console.log("delete successfully");
        } catch (err) {
            console.log("error in deleting", err);
        }
    }

    static async saveOTP(email: string, OTP: string) {
        try {
            await redisClient.setex(email, 300, JSON.stringify({
                otp: OTP
            }));
            console.log("otp stored successfully");
        } catch (err) {
            console.log(err);
        }
    }

    static async getOTP(email: string) {
        try {
            const otp_details = await redisClient.get(email);
            const userOTP = JSON.parse(otp_details);
            return userOTP.otp;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}
