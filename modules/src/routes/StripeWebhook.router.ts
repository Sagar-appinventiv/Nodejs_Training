import { ServerRoute } from '@hapi/hapi';
import { StripeWebhookController } from '../controllers/stripe.controller';

const stripeWebhookRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/webhooks/stripe',
        handler: StripeWebhookController.handleCheckoutCompletedEvent,
    },
];

export default stripeWebhookRoutes;