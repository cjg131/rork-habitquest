import { protectedProcedure } from '../../trpc';
import { z } from 'zod';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe('sk_test_your_stripe_secret_key_here', {
  apiVersion: '2022-11-15',
});

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
        email: ctx.user.email,
        name: ctx.user.name || undefined,
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
