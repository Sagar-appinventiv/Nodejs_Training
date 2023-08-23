import * as redis from "redis";

let client:any;

(async function () {
    client = await redis.createClient();
    try {
        await client.connect();
        console.log("------- Connected to Redis -------");
    } catch (error) {
        console.log("!!! Redis connection error : ", error);
    }
})();


export class Redis {
    static async maintain_redisSession(isUser:any) {
        try {
            await client.SET(isUser.email, JSON.stringify({
                user_id: isUser.id,
                status: true
            }));
            const session = await client.GET(isUser.email);
            console.log(session);
        } catch (error) {
            console.log("!!! Error : ", error);
        }
    }

    static async logout_redisSession(isUser:any) {
        try {
            await client.SET(isUser.email, JSON.stringify({
                user_id: isUser.id,
                status: false
            }));
            const session = await client.GET(isUser.email);
            console.log(session);
            return true;
        } catch (error) {
            console.log("!!! Error : ", error);
            return false;
        }
    }

    static async save_otp(email: any, OTP: any) {
        try {
            await client.SETEX(email, 300, JSON.stringify({
                otp: OTP
            }));
            console.log("------- OTP stored successfully -------");
        } catch (error) {
            console.log("!!! Error : ", error);
        }
    }
    static async get_otp(email: any) {
        if (await client.exists(email)) {
            const otp_details = await client.GET(email);
            const userOTP = JSON.parse(otp_details);
            return userOTP.otp;
        }
        else {
            return false;
        }
    }
}
