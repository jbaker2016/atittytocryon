import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const reservationRouter = createTRPCRouter({
    
  addReservation: publicProcedure
    .input(
        z.object({
            reservationId: z.string(),
            nameCustomer: z.string(),
            emailCustomer: z.string(),
            phoneCustomer: z.string(),
            selectedTime: z.string(),
            minutes: z.string(),
            cost: z.string(),
        })
      )

    .mutation(async ({ ctx, input }) => {
        const reservation = await ctx.prisma.reservation.update({
            where: {
              id: input.reservationId,
            },
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

      updateReservationPaid: publicProcedure
      .input(
          z.object({
              reservationId: z.string(),
          })
        )
  
      .mutation(async ({ ctx, input }) => {
          const reservation = await ctx.prisma.reservation.update({
              where: {
                id: input.reservationId,
              },
              data: {
                  paid: true,
              },
          })
          return reservation
        }),

      createEmptyReservation: publicProcedure
  
      .mutation(async ({ ctx, input }) => {
          const reservation = await ctx.prisma.reservation.create({
              data: {
                  nameCustomer: '',
                  emailCustomer: '',
                  phoneCustomer: '',
                  selectedTime: '',
                  minutes: '',
                  cost: '',
                  paid: false,
              },
          })
          return reservation
        }),

    getReservations: adminProcedure.query(async ({ ctx }) => {
      
      const reservations = await ctx.prisma.reservation.findMany()

      return reservations

    }),

    getReservedTimes: publicProcedure.query(async ({ ctx }) => {
      
      const reservations = await ctx.prisma.reservation.findMany({ select: { selectedTime: true, minutes: true } })
  
      return reservations

    }),

    deleteReservation: adminProcedure
    .input(z.object({id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Delete reservation from db
      const { id }  = input
      await ctx.prisma.reservation.delete({ where: { id } })

      return true
    })
  })