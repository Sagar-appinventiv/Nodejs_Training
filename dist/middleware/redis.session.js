"use strict";
// import redisClient from './redisClient';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisSession = void 0;
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
const redisClient_1 = __importDefault(require("./redisClient"));
class RedisSession {
    static maintainSession(user, device) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (user) {
                    yield redisClient_1.default.set(user.email, JSON.stringify({
                        'user_id': user.id,
                        'device_id': device,
                        'status': true
                    }));
                    const redisSession = yield redisClient_1.default.get(user.email);
                    console.log(redisSession);
                }
                else {
                    console.log("User not found");
                }
            }
            catch (err) {
                console.log("Redis not set successfully", err);
            }
        });
    }
    static logoutSession(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(user.email);
            try {
                yield redisClient_1.default.del(user.email);
                console.log("delete successfully");
            }
            catch (err) {
                console.log("error in deleting", err);
            }
        });
    }
    static saveOTP(email, OTP) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield redisClient_1.default.setex(email, 300, JSON.stringify({
                    otp: OTP
                }));
                console.log("otp stored successfully");
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    static getOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp_details = yield redisClient_1.default.get(email);
                const userOTP = JSON.parse(otp_details);
                return userOTP.otp;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
}
exports.RedisSession = RedisSession;
//# sourceMappingURL=redis.session.js.map