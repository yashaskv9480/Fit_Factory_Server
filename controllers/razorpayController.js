const RazorPay = require("razorpay");
const crypto = require("crypto");

exports.createOrders = async (req, res) => {
  try {
    var instance = new RazorPay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    var options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };
    instance.orders.create(options, function (err, order) {
      if (err) {
        console.log(order);
        return res.status(500).json({ message: "Something went wrong" });
      }
      res.status(200).json({ data: order });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating order ID" });
  }
};

exports.paymentVerify = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const generated_signature = await hmac_sha256(
      razorpay_order_id + "|" + razorpay_payment_id,
      process.env.RAZORPAY_KEY_SECRET,
    );

    if (razorpay_signature === generated_signature) {
      return res.status(200).json({ message: "Payement Successfull" });
    }
    res.status(400).json({ message: "Payment failed" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

async function hmac_sha256(data, key) {
  const hmac = crypto.createHmac("sha256", key);
  hmac.update(data);
  return hmac.digest("hex");
}
