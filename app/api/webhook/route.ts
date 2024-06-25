import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { firestore } from '@/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY!, {
  apiVersion: '2024-04-10',
});

export const runtime = 'nodejs';

// Helper function to get raw body
async function getRawBody(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const readableStream = req.body as ReadableStream<Uint8Array>;
  const reader = readableStream.getReader();
  
  let done: boolean | undefined = false;
  while (!done) {
    const { done: chunkDone, value } = await reader.read();
    if (chunkDone) {
      done = true;
      break;
    }
    if (value) {
      chunks.push(value);
    }
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const buf = await getRawBody(req);
    const sig = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.log(`Webhook signature verification failed.`, errorMessage);
      return NextResponse.json({ message: `Webhook error: ${errorMessage}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const metadata = session.metadata;
      if (!metadata) {
        return NextResponse.json({ message: 'Missing metadata in session' }, { status: 400 });
      }

      const userId = metadata.userId;
      const formdata = metadata.formdata;

      try {
        const cartRef = firestore.collection('users').doc(userId).collection('cart');
        const cartSnapshot = await cartRef.get();

        if (cartSnapshot.empty) {
          return NextResponse.json({ message: 'Cart is already empty' }, { status: 200 });
        }

        const historyRef = firestore.collection('users').doc(userId).collection('history');
        const groupedItem = {
          items: cartSnapshot.docs.map(doc => doc.data()),
          formdata,
          timestamp: new Date()
        };

        await historyRef.add(groupedItem);

        const deletePromises = cartSnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);

        return NextResponse.json({ message: 'Success' }, { status: 200 });
      } catch (error) {
        console.error('Error handling checkout.session.completed:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ message: `Unhandled event type: ${event.type}` }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
