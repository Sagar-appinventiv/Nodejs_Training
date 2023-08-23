import Stripe from 'stripe';
import { User } from '../models/user.model';
import dotenv from 'dotenv';
import { Request, ResponseToolkit } from '@hapi/hapi';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-08-16',
});

export class StripeWebhookController {
    static async handleCheckoutCompletedEvent(request: Request, h: ResponseToolkit) {
            // const event: Stripe.Event = request.payload as Stripe.Event;
            const payload:any = request.payload;
            const sigHeader = request.headers['stripe-signature'];

            console.log('Stripe-Signature Header:', sigHeader);
console.log('Raw Payload:', payload);
            try {
            const event = stripe.webhooks.constructEvent(payload, sigHeader, process.env.STRIPE_WEBHOOK_SECRET!);
            console.log('Received webhook event:', event);
            const eventType = event.type;
            console.log('Event type:', eventType);

            if (eventType === 'checkout.session.completed') {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log("Session ID:", session.id);

                const userRefId = session.client_reference_id as string;
                console.log("User Reference ID:", userRefId);

                const user = await User.findOne({ where: { id: userRefId } });
                console.log("User:", user);

                if (user && session.payment_status === 'paid') {
                    await user.update({ verifiedUser: true });
                    console.log(`User ${user.email} has been successfully subscribed.`);
                    return h.response({ received: true }).code(200);
                } else {
                    console.log('User not found or payment not completed.');
                    return h.response({ received: false }).code(400);
                }
            } else {
                console.log('Unhandled event type:', eventType);
                return h.response({ received: false }).code(400);
            }
        } catch (error) {
            console.error('Error handling webhook event:', error);
            return h.response({ status: 'Error handling webhook event' }).code(500);
        }
    }
}
