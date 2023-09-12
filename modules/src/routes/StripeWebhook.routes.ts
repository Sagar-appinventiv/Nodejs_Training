import { ServerRoute } from '@hapi/hapi';
import { StripeWebhookController } from '../controllers/stripe.controller';

const stripeWebhookRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/webhooks/stripe',
        handler: StripeWebhookController.handleCheckoutCompletedEvent,
        // options:{
        //     auth: 'user',
        //     tags: ['api','Payment related APIs'],
        //     description: 'Fetch payment status fron stripe API',
        //     validate:{
        //         options:{
        //             allowUnknown:true,
        //             security:[{ apiKey:[] }]
        //         }
        //     }
        // }
    },
];

export default stripeWebhookRoutes;