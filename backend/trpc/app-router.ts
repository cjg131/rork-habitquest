import { createTRPCRouter } from "./create-context";
import { hiProcedure } from './routes/example/hi/route';
import { createPaymentIntentProcedure } from './routes/stripe/payment-intent/route';

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiProcedure,
  }),
  stripe: createTRPCRouter({
    createPaymentIntent: createPaymentIntentProcedure,
  }),
});

export type AppRouter = typeof appRouter;