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
  await stripe.terminal.readers.cancelAction(READER_ID);
  return NextResponse.json({ message: "done" });
}

export const dynamic = "force-dynamic";

