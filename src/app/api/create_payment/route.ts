import { NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SK) {
  throw "process.env.STRIPE_SK not set";
}

if (!process.env.READER_ID) {
  throw "READER_ID not defined";
}
const READER_ID = process.env.READER_ID;

const stripe = new Stripe(process.env.STRIPE_SK);

export async function GET(request: Request) {
  const intent = await stripe.paymentIntents.create({
    amount: 500,
    currency: "gbp",
    payment_method_types: ["card_present"],
  });

  var attempt = 0;
  const tries = 3;

  while (attempt < tries) {
    attempt++;
    try {
      const reader = await stripe.terminal.readers.processPaymentIntent(
        READER_ID,
        {
          payment_intent: intent.id,
        }
      );
      break;
    } catch (error) {
      console.log(error);
      return NextResponse.json(error);
    }
  }
  return NextResponse.json({ message: "Sent to Terminal" });
}

export const dynamic = "force-dynamic";
