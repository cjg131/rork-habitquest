import { createTRPCRouter } from "./create-context";
// hiProcedure export name may be incorrect
// import { hiProcedure } from './routes/example/hi/route';
import * as hiModule from './routes/example/hi/route';
import { createPaymentIntentProcedure } from './routes/stripe/payment-intent/route';

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    // hi: hiProcedure,
    hi: (hiModule as any).hiProcedure,
  }),
  stripe: createTRPCRouter({
    createPaymentIntent: createPaymentIntentProcedure,
  }),
});

export type AppRouter = typeof appRouter;