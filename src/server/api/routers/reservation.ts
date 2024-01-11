import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const reservationRouter = createTRPCRouter({
    
    addReservation: publicProcedure
        
        .input(
            z.object({
                nameCustomer: z.string(),
                emailCustomer: z.string(),
                phoneCustomer: z.string(),
                selectedTime: z.string(),
                minutes: z.string(),
                cost: z.string(),
            })
          )

        .mutation(async ({ ctx, input }) => {
            const reservation = await ctx.prisma.reservation.create({
                data: {
                    nameCustomer: input.nameCustomer,
                    emailCustomer: input.emailCustomer,
                    phoneCustomer: input.phoneCustomer,
                    selectedTime: input.selectedTime,
                    minutes: input.minutes,
                    cost: input.cost,
                },
            })
            return reservation
          }),
  })