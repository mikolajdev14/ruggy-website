import Stripe from "stripe";

let stripeClient: Stripe | undefined;

export function getStripe() {
  if (stripeClient) {
    return stripeClient;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "Brak STRIPE_SECRET_KEY. Dodaj tę zmienną w środowisku serwera.",
    );
  }

  stripeClient = new Stripe(secretKey);
  return stripeClient;
}
