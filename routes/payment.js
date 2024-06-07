const razorpayController = require("../controllers/razorpayController");
const express = require("express");
const router = express.Router();
const jwtAuthenticator = require("../controllers/jwtAuthenticator");
router.use(express.json());

router.post(
  "/orders",
  jwtAuthenticator.isUser,
  razorpayController.createOrders
);

router.post(
  "/verify",
  jwtAuthenticator.isUser,
  razorpayController.paymentVerify
);

module.exports = router;
