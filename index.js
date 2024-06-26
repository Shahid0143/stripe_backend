const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const stripe = require("stripe")(process.env.SECRET_STRIPE_KEY);

// Middleware
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
  res.send("Hello World!")
})

// Route for creating checkout session
app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "usd",
            unit_amount: item.price * 100,
            product_data: {
              name: item.title,
            },
          },
          quantity: item.quantity,
        };
      }),
      success_url: "https://stripe-integration-frontend.vercel.app/success",
      cancel_url: "https://stripe-integration-frontend.vercel.app/cancel",
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
