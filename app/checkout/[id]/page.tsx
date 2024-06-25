// app/components/[id]/page.js or /route.js
'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const checkoutSessionId = Array.isArray(params.id) ? params.id[0] : params.id; 

  useEffect(() => {
    async function redirectToStripeCheckout() {
      const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY!);
      const stripe = await stripePromise;
      if (stripe && checkoutSessionId) { 
        await stripe.redirectToCheckout({ sessionId: checkoutSessionId });
      } else {
        // Handle the error case where the session ID is missing or invalid
        console.error("Error: Invalid or missing checkout session ID.");
        router.push('/basket'); // Redirect to the cart page or an error page
      }
    }
    redirectToStripeCheckout();
  }, [checkoutSessionId]);

  return <div>Redirecting to Stripe Checkout...</div>;
}
