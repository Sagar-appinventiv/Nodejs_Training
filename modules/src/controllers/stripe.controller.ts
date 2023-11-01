import Stripe from 'stripe';
import dotenv from 'dotenv';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { UserE } from '../entities/user.entity';
import { User } from '../models/user.model';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-08-16',
});

export class StripeWebhookController {
    /***************************************************/
    /*********** Fetching Payment Status API ***********/
    /***************************************************/
    static async handleCheckoutCompletedEvent(request: Request, h: ResponseToolkit) {
        try {
            const event: Stripe.Event = request.payload as Stripe.Event;
            console.log('Received webhook event:', event);            // console.log('Event type:', eventType);

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log("Session ID:", session.id);

                const userRefId = session.client_reference_id as string;
                const user = await User.findOne({ where: { id: userRefId } });

                if (user && session.payment_status === 'paid') {
                    await UserE.updateVerification(userRefId);

                    console.log(`------- User has been successfully subscribed. -------`);
                    return h.response({ received: true }).code(200);
                } else {
                    console.log('User not found or payment not completed.');
                    return h.response({ received: false }).code(400);
                }
            } else {
                console.log('Unhandled event type:', event.type);
                return h.response({ received: false }).code(400);
            }
        } catch (error) {
            console.error('Error handling webhook event:', error);
            return h.response({ status: 'Error handling webhook event' }).code(500);
        }
    }
}
