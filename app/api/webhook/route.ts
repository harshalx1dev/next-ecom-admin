import { ecomDb } from "@/lib/ecom-db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
    body, signature, process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.log('WEBHOOK_ERROR: ', error);
    return new NextResponse(`WEBHOOK_ERROR: ${error.message}`, {status: 500})
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country
  ];

  const addressString = addressComponents.filter(Boolean).join(', ');

  if (event.type === "checkout.session.completed") {
    const order = await ecomDb.order.update({
      where: {
        id: session?.metadata?.orderId
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || '',
      },
      include: {
        orderItems: true
      }
    })

    const productIds = order.orderItems.map((ord) => ord.productId);
    await ecomDb.product.updateMany({
      where: {
        id: {
          in: [...productIds]
        }
      },
      data: {
        isArchived: true
      }
    })
  }

  return new NextResponse(null, { status: 200 })
}