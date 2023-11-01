import { User } from "../models/user.model";
import { Request, ResponseToolkit } from '@hapi/hapi';
import bcrypt from 'bcrypt';
import fs from 'fs';
import { ArchivedUser } from "../models/archivedUser.model";
import { UserE } from "../entities/user.entity";
import { SessionE } from "../entities/session.entity";

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

            const isUser = await UserE.ifEmailExists(user.email);
            const isActive = await SessionE.ifSessionExists(isUser.id);
            if (!isActive.status) {
                return h.response({ status: "!!! User is inactive !!!" });
            }
            else {
                const isValidPassword = await bcrypt.compare(oldPassword, isUser.password);
                if (!isValidPassword) {
                    return h.response({ status: '!!! Incorrect old password !!!' }).code(401);
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
               
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
            const isUser = await UserE.ifEmailExists(user.email);
            // console.log('----isUser--------',isUser);
            const isActive = await SessionE.ifSessionExists(isUser.id);
            // console.log('--------isActive--------',isActive);
            if (isActive.status) {
                const existingUser = await ArchivedUser.findOne({ where: { email: isUser.email } });

                if (existingUser) {
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

                } else {
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
                await SessionE.DeleteSession(isUser.id);
                await isUser.destroy();
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
            const isUser = await UserE.ifEmailExists(user.email);
            const isActive = await SessionE.ifSessionExists(isUser.id);
            if (!isActive.status) {
                return h.response({ status: "!!! User is inactive !!!" });
            }
            else {
                const data: any = request.payload;
                // return data;
                // console.log("data?>>>>>>>>>>>S",JSON.stringify(data));
                if (!data.file) {
                    return h.response({ message: "!!! No file Provided !!!" }).code(400);
                }
                const name = data.file.hapi.filename;
                // console.log("name>>>>>>>>>",name);
                const path = `${process.cwd()}/view/uploads/` + name;

                const file = fs.createWriteStream(path);
                // console.log(file);
                data.file.pipe(file);

                return new Promise((resolve, reject) => {
                    file.on('finish', async () => {
                        try {
                            await UserE.updateProfilePicture(isUser.id, name);
                            resolve(h.response({ message: "------- Profile picture uploaded successfully -------" }).code(200));
                        } catch (error) {
                            console.log("Error", error);
                            reject(h.response({ message: "!!! Error updating profile picture !!!" }).code(500));
                        }
                    });

                    file.on('error', (error) => {
                        // console.log(error);
                        reject(h.response({ message: "!!! Error writing file !!!" }).code(500));
                    });
                });
            }
        } catch (error) {
            console.log("ERROR", error);
            return h.response({ message: "Error:" }).code(500);
        }
    }

    /***************************************************/
    /******************** Gallery API ******************/
    /***************************************************/
    static async setGalleryPhotos(request: any, h: any) {
        try {
            const user = request.auth.credentials;
            const isUser = await UserE.ifEmailExists(user.email);

            const isActive = await SessionE.ifSessionExists(isUser.id);
            if (!isActive.status) {
                return h.response({ status: "!!! User is inactive !!!" });
            }
            if (!isUser || !isUser.verifiedUser) {
                return h.response({ status: '!!! User is not verified !!!' }).code(403);
            }
            else {
                const data: any = request.payload;
                // return data;
                // console.log("data?>>>>>>>>>>>S",JSON.stringify(data));
                console.log(data.file);
                if (!data.file.length) {
                    return h.response({ message: "!!! No file Provided !!!" }).code(400);
                }

                const name: any = [];
                for (let i = 0; i < data.file.length; i++) {
                    const img_name = data.file[i].hapi.filename;
                    name.push(img_name);
                    // console.log("name>>>>>>>>>",name);
                    const path = `${process.cwd()}/view/uploads/` + img_name;

                    const file = fs.createWriteStream(path);
                    // console.log(file);
                    data.file[i].pipe(file);
                }

                try {
                    await UserE.updateGallery(isUser.id,name);
                    return h.response({ message: "success" });
                }
                catch (err) {
                    console.log(err);
                    return h.response("error");
                }
            }
        } catch (error) {
            console.log("ERROR", error);
            return h.response({ message: "Error:" }).code(500);
        }
    }
}