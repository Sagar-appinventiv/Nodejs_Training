import { User } from "../models/user.model";
import { Request, ResponseToolkit } from '@hapi/hapi';
import bcrypt from 'bcrypt';
import { Redis } from '../middlewares/redis.middleware';
import nodemailer from 'nodemailer';
import { Sessions } from '../middlewares/session.middleware';
import { Session } from '../models/session.model';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { ArchivedUser } from "../models/archivedUser.model";
import JSONTransport from "nodemailer/lib/json-transport";


export class UserSettingsController {

    /***************************************************/
    /**************** Edit Password API ****************/
    /***************************************************/
    static async editPassword(request: Request, h: ResponseToolkit) {
        try {
            const user: any = request.auth.credentials;
            const { oldPassword, newPassword } = request.payload as {
                oldPassword: string;
                newPassword: string;
            };

            const isUser = await User.findOne({ where: { email: user.email } });

            const isActive = await Session.findOne({ where: { userId: isUser.id } });
            console.log(isActive);
            if (!isActive.status) {
                return h.response({ status: "User is inactive" });
            }
            else {
                const isValidPassword = await bcrypt.compare(oldPassword, isUser.password);
                if (!isValidPassword) {
                    return h.response({ status: '!!! Incorrect old password !!!' }).code(401);
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                // user.password = hashedPassword;
                // await user.save();
                // await Sessions.update_session(user.id);
                const password = await User.update({ password: hashedPassword }, { where: { id: isUser.id } });

                return h.response({ status: '------- Password updated successfully -------' });
            }
        } catch (error) {
            console.log(error);
            return h.response({ status: '!!! Server error !!!' }).code(500);
        }
    }

    /***************************************************/
    /**************** Delete Account API ***************/
    /***************************************************/
    static async deleteAccount(request: Request, h: ResponseToolkit) {
        try {
            const user: any = request.auth.credentials;
            // console.log(user);
            const isUser = await User.findOne({ where: { email: user.email } });
            // console.log('----isUser--------',isUser);
            const isActive = await Session.findOne({ where: { userId: isUser.id } });
            // console.log('--------isActive--------',isActive);
            if (isActive.status) {
                const existingUser = await ArchivedUser.findOne({ where: { email: isUser.email } });

                if(existingUser) {
                    await existingUser.update({
                        fullName: isUser.fullName,
                        email: isUser.email,
                        password: isUser.password,
                        mobile_no: isUser.mobile_no,
                        profilePicture: isUser.profilePicture,
                        interestedIn: isUser.interestedIn,
                        gender: isUser.gender,
                        areaLocality: isUser.areaLocality,
                        hobbies: isUser.hobbies,
                        dateOfBirth: isUser.dateOfBirth
                    })

                }else {
                await ArchivedUser.create({
                    fullName: isUser.fullName,
                    email: isUser.email,
                    password: isUser.password,
                    mobile_no: isUser.mobile_no,
                    profilePicture: isUser.profilePicture,
                    interestedIn: isUser.interestedIn,
                    gender: isUser.gender,
                    areaLocality: isUser.areaLocality,
                    hobbies: isUser.hobbies,
                    dateOfBirth: isUser.dateOfBirth
                })
            }
                await Session.destroy({ where: { userId: isUser.id } });
                await isUser.destroy();
                // console.log(isUser);
                return h.response({ message: "------- Account deleted successfully -------" }).code(200);
            }
            else {
                return h.response({ status: "!!! User is inactive !!!" });
            }
        } catch (error) {
            console.log(`----error--------`, error)
            return h.response({ status: '!!! Internal server error !!! ' }).code(500);
        }
    }

    /***************************************************/
    /************** Set Profile Picture API ************/
    /***************************************************/
    static async setProfilePicture(request: any, h: ResponseToolkit) {
        try {
            const user = request.auth.credentials;
            const isUser = await User.findOne({ where: { email: user.email } });
            const isActive = await Session.findOne({ where: { userId: isUser.id } });
            if (!isActive.status) {
                return h.response({ status: "User is inactive" });
            }
            else {
                const data: any = request.payload;
                return data;
                console.log("data?>>>>>>>>>>>S",JSON.stringify(data));
                if (!data.file) {
                    return h.response({ message: "No file Provided" }).code(400);
                }
                const name = data.file.filename;
                console.log("name>>>>>>>>>",name);
                const path = `${process.cwd()}/src/uploads/` + name;

                const file = fs.createWriteStream(path);
                console.log(file);
                data.file.pipe(file);

                return new Promise((resolve, reject) => {
                    file.on('finish', async () => {
                        try {
                            await User.update({ profilePicture: name }, {where: { email: isUser.email }
                            });
                            resolve(h.response({ message: "Profile picture uploaded successfully" }).code(200));
                        } catch (error) {
                            console.log("Error", error);
                            reject(h.response({ message: "Error updating profile picture" }).code(500));
                        }
                    });

                    file.on('error', (error) => {
                        console.log(error);
                        reject(h.response({ message: "Error writing file" }).code(500));
                    });
                });
            }
        } catch (error) {
            console.log("ERROR", error);
            return h.response({message:"Error:"}).code(500);
        }
    }
}