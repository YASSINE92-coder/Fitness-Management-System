import Stripe from "stripe";
const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY;
if (!STRIPE_PRIVATE_KEY) throw new Error("stripe key not valide");
const stripe = new Stripe(STRIPE_PRIVATE_KEY);
export default stripe;
