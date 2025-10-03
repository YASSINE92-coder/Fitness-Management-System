import Program from "../models/Program.js";
import AppError from "../errors/AppError.js";
import stripe from "../config/plugins/stripe.js";

export const buyProgram = async (req, res) => {
  // const { id } = req.body || {};
  // const program = await Program.findById(id);
  // if (!program) throw AppError("this program is no longuer available", 404);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: "https://google.com",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "program_demo",
          },
          unit_amount: 4000,
        },
        quantity: 1,
      },
    ],
  });
  res.redirect(session.url);
};
