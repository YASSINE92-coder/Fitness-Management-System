import Program from "../models/Program.js";
import AppError from "../errors/AppError.js";
import stripe from "../config/plugins/stripe.js";
import User from "../models/User.js";

const paymentController = {
  checkoutProgram: async (req, res) => {
    const { id } = req.params;
    const program = await Program.findById(id);
    if (!program)
      throw new AppError("this program is no longuer available", 404);
    console.log(process.env.SERVER_URL + process.env.PORT);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${
        process.env.SERVER_URL + process.env.PORT
      }/api/programs/${id}/buy`,
      cancel_url: `${process.env.CLIENT_URL}/payment/canceled`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: program.title,
            },
            unit_amount: Math.ceil(program.price),
          },
          quantity: 1,
        },
      ],
    });
    res.redirect(session.url);
  },

  buyProgram: async (req, res) => {
    const { id } = req.params;

    const program = await Program.findById(id);
    if (!program) throw new AppError("program does not exist", 404);

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError("user does not exist", 404);

    user.bought_programs.push(id);
    await user.save();

    program.bought_by.push(user._id);
    return res.redirect(`${process.env.CLIENT_URL}/payment/success`);
  },
};

export default paymentController;
