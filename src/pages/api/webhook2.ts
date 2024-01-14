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

  if (req.method === "POST") {
    try {

      res.status(200).send('ok');
      //res.status(200).end();

      //res.json({ received: true });
    } catch (err) {
      res.status(400).send(err);
      return;
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
} 