import { User } from "../models/user.model";
import { Request, ResponseToolkit } from '@hapi/hapi';
import { Session } from '../models/session.model';
import Stripe from 'stripe';
import { Op, Sequelize } from 'sequelize';
import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-08-16',
});

// async function createStripeSession(email: string): Promise<Stripe.Checkout.Session | null> {
//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//         console.log('User not found');
//         return null;
//     }

//     try {
//         const customer = await stripe.customers.create({ email: user.email });

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: [
//                 {
//                     price: 'price_1NgSjwSDbdK8pDQVmIR5IWoC',
//                     quantity: 1,
//                 },
//             ],
//             mode: 'subscription',
//             success_url: 'https://www.example.com/success',
//             cancel_url: 'https://www.example.com/cancel',
//             customer: customer.id,
//             client_reference_id: user.id.toString(),
//         });

//         console.log('Stripe API Response:', session); // Log the session object
//         console.log('Generated session ID:', session.id); // Add this line for debugging

//         return session;
//     } catch (error) {
//         console.log('!!! Error creating checkout session : ', error);
//         return null;
//     }
// }

export class UserProfileController {

    /***************************************************/
    /************** Update User Details API ************/
    /***************************************************/
    static async updateUserDetails(request:Request, h:ResponseToolkit) {
        try {
            const user: any = request.auth.credentials;
            const {interestedIn, areaLocality, hobbies, mobileNo, dateOfBirth, gender, bio} = request.payload as {
                interestedIn: string;
                areaLocality: string;
                hobbies: string[];
                mobileNo: string;
                dateOfBirth: string;
                gender: string;
                bio: string;
            }
            const isUser = await User.findOne({where: {email: user.email}});

            const isActive = await Session.findOne({where: {userId:isUser.id}});
            if(!isActive.status){
                // console.log('-----isActive-----',isActive);
                return h.response({status: "!!! User is inactive !!!"});
            }
            const updatedUser = await User.update({interestedIn, areaLocality, hobbies, mobileNo, dateOfBirth, gender, bio}, { where: {id:isUser.id}});
            console.log('-----UpdateuserDetials-----: ', updatedUser);
            const userdetails = await User.findOne({where: {id: isUser.id}})
            // return h.response({message: '------- User details updated successfully -------'}).code(200);
            const queryparams = new URLSearchParams({isUser: JSON.stringify(userdetails)});
            return h.redirect('/profile?' + queryparams.toString());
        } catch(error) {
            console.log('!!! Error !!!', error);
            return h.response({status: '!!! Server Error !!!'}).code(500);
        }
    }

    /***************************************************/
    /*************** View Own Profile API **************/
    /***************************************************/

    static async viewOwnProfile(request: Request, h:ResponseToolkit) {
        try {
            const user:any = request.auth.credentials;
            const userProfile = await User.findOne({where:{email:user.email}});
            const isActive = await Session.findOne({where: {userId:userProfile.id}});
            // console.log('--------isActive--------',isActive);
            if(!isActive.status){
                return h.response({status: "!!! User is inactive !!!"});
            }
            else if(!userProfile) {
                return h.response({message: '!!! User profile not found !!!'}).code(404);
            }

            console.log(userProfile);
            // return h.response(userProfile).code(200);
            return h.view('profile', {user: userProfile});
        }catch(error) {
            console.error('!!! Server Error: ', error);
            return h.response({ status: '!!! Server error !!!' }).code(500);
        }
    }

    /***************************************************/
    /*************** View User Profile API *************/
    /***************************************************/
    static async viewUserProfile(request: Request, h: ResponseToolkit) {
        try {
            const self: any = request.auth.credentials;
            const isUser = await User.findOne({ where: { email: self.email } });
            const isActive = await Session.findOne({ where: { userId: isUser.id } });
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' })
            }
            const userId = request.params.userId; // Get the userId from the route parameter
            const user = await User.findByPk(userId, {
                attributes: [
                    'id',
                    'fullName',
                    'bio',
                    'profilePicture',
                    'galleryPhotos',
                    'interestedIn',
                    'gender',
                    [Sequelize.fn('DATE_PART', 'year', Sequelize.fn('age', Sequelize.col('dateOfBirth'))), 'age'],
                    'areaLocality',
                    'hobbies',
                    'verifiedUser'
                ],
            });
    
            if (!user) {
                return h.response({ status: '!!! User not found !!!' }).code(404);
            }
    
            return h.response(user).code(200);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return h.response({ status: '!!! Error fetching user profile !!!' }).code(500);
        }
    }


    /***************************************************/
    /***************** Subscription API ****************/
    /***************************************************/
    static async subscribe(request:Request, h: ResponseToolkit) {
        try {
            const user: any = request.auth.credentials;
            console.log(">>>>>>>>>>>>>>>>>",user);
            // const { email } = request.payload as { email : string};
            const isUser = await User.findOne({where: {email: user.email}});
            const isActive = await Session.findOne({where: {userId:isUser.id}});

            console.log('User:', user);
            console.log('Is User:', isUser);
            if(!isActive.status){
                return h.response({status: "!!! User is inactive !!!"});
            }
            const customer = await stripe.customers.create({email: isUser.email});
            const premiumPlan = process.env.PREMIUM_PLAN_ID!;

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price: premiumPlan,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: 'https://www.youtube.com/@SACREDGAMERS26',
            cancel_url: 'http://your-website.com/cancel',
            customer: customer.id,
            client_reference_id: isUser.id.toString(),
            });

            console.log('Stripe API Response:', session); // Log the session object
            console.log('Generated session ID:', session.id); // Add this line for debugging
            

            return h.response({ session}).code(200);
            // const { email } = request.payload as { email: string };

            // // Process the subscription and create a Stripe session
            // const session = await createStripeSession(email);
    
            // if (session && session.id) {
            //     // Transaction successful, update verifiedUser status
            //     await User.update({ verifiedUser: true }, { where: { email } });
    
            //     return h.response({ status: 'Subscription successful', sessionId: session.id }).code(200);
            // }
    
            // return h.response({ status: 'Subscription failed' }).code(500);
        }catch (error) {
            console.log('!!! Error creating checkout session : ', error);
            return h.response({error: '!!! Error creating checkout session !!!'}).code(500);
        }
    }
}