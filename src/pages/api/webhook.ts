import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import Stripe from "stripe";
import { buffer } from "micro";
import { trpc } from "~/utils/trpc";


// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

export const stripe = new Stripe(process.env.STRIPE_SK!, {
    apiVersion: "2023-10-16",
  });

const webhookSecret = process.env.STRIPE_WH_SECRET || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === "POST" || req.method === "GET") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);

      // Handle the event
      switch (event.type) { 
        case "checkout.session.completed":
          
          //const paymentIntentSucceeded = event.data.object
          
          const data = event.data.object
          const orderId = data.metadata?.orderId
          const paid = data.payment_status === 'paid'

          if (orderId && paid){
            //const { mutate: updateReservationPaid } = trpc.reservation.updateReservationPaid.useMutation()
            
            const dataprisma = await prisma.reservation.update({
              where: {
                id: orderId,
              },
              data: {
                paid: true,
              },
            })
          }
          break;

        default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
      
      }

      res.status(200).send('ok');

      res.json({ received: true });
    } catch (err) {
      res.status(400).send(err+"sig"+sig);
      return;
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed"+req.method);
  }
} 