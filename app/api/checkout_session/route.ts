import { ProductswithID } from "@/lib/Product";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY!, {
  apiVersion: "2024-04-10",
});

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const {
    cartItems,
    userId,
    expressDelivery,
    formdata,
  }: {
    cartItems: ProductswithID[];
    userId: string;
    expressDelivery: boolean;
    formdata: {
      fullName: string;
      address: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phoneNumber: string;
      express?: boolean | undefined;
    };
  } = await req.json();

  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: "INR",
      product_data: {
        name: item.title,
        images: [item.thumbnailImage],
        metadata: {
          productId: item.asin,
        },
      },
      unit_amount: item.price * 100,
    },
    quantity: 1,
  }));

  const groupedLineItems = lineItems.reduce((acc, item) => {
    if (item.price_data?.product_data) {
      const existingItem = acc.find(
        (i) =>
          i.price_data?.product_data?.name === item.price_data.product_data.name
      );
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1;
      } else {
        acc.push(item);
      }
    }
    return acc;
  }, [] as Stripe.Checkout.SessionCreateParams.LineItem[]);

  try {
    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] =
      expressDelivery
        ? [{ shipping_rate: "shr_1PHOHFBrSHURCIGudV7Jlve7" }]
        : [];

    // Truncate or simplify cartItems metadata to avoid exceeding the 500-character limit
    const truncatedCartItems = cartItems.map((item) => ({
      asin: item.asin,
      title: item.title,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      shipping_options: shippingOptions,
      line_items: groupedLineItems,
      success_url: `${req.headers.get("origin")}`,
      cancel_url: `${req.headers.get("origin")}/shipping`,
      metadata: {
        userId,
        truncatedCartItems: JSON.stringify(truncatedCartItems).substring(0, 400), // Ensure metadata is within limit
        formdata: JSON.stringify(formdata).substring(0, 400) // Ensure metadata is within limit
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.error();
  }
}
