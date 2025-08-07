import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
// Stripe API version needs to be updated
// const stripe = new Stripe('sk_test_your_stripe_secret_key_here', {
//   apiVersion: '2022-11-15',
// });
// Using mock data for now
const stripe = {
  customers: {
    create: async (params?: any) => ({ id: 'mock_customer_id' })
  },
  ephemeralKeys: {
    create: async (params?: any, options?: any) => ({ secret: 'mock_ephemeral_key' })
  },
  paymentIntents: {
    create: async (params?: any) => ({ client_secret: 'mock_payment_intent_secret' })
  }
};

export const createPaymentIntentProcedure = protectedProcedure
  .input(
    z.object({
      amount: z.number().positive(),
      currency: z.string().default('usd'),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      // Create or retrieve customer
      const customer = await stripe.customers.create({
        email: 'user@example.com', // In real implementation, get from ctx.user
      });

      // Create ephemeral key
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2022-11-15' }
      );

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: input.amount,
        currency: input.currency,
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  });
