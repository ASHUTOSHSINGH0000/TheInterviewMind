// import Payment from "../models/payment.model.js";
// import User from "../models/user.model.js";
// import razorpay from "../services/razorpay.service.js";
// import crypto from "crypto"

// export const createOrder = async (req,res) => {
//     try {
//         const {planId, amount, credits} = req.body;
//           if (!amount || !credits) {
//       return res.status(400).json({ message: "Invalid plan data" });
//     }

//      const options = {
//       amount: amount * 100, // convert to paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options)

//      await Payment.create({
//       userId: req.userId,
//       planId,
//       amount,
//       credits,
//       razorpayOrderId: order.id,
//       status: "created",
//     });

//     return res.json(order);

//     } catch (error) {
//          return res.status(500).json({message:`failed to create Razorpay order ${error}`})
//     }
// }

// export const verifyPayment = async (req,res) => {
//     try {
//         const {razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature} = req.body

//       const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Invalid payment signature" });
//     }

//      const payment = await Payment.findOne({
//       razorpayOrderId: razorpay_order_id,
//     });

//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     if (payment.status === "paid") {
//       return res.json({ message: "Already processed" });
//     }

//     // Update payment record
//     payment.status = "paid";
//     payment.razorpayPaymentId = razorpay_payment_id;
//     await payment.save();

//     // Add credits to user
//     const updatedUser = await User.findByIdAndUpdate(payment.userId, {
//       $inc: { credits: payment.credits }
//     },{new:true});

//     res.json({
//       success: true,
//       message: "Payment verified and credits added",
//       user: updatedUser,
//     });

//     } catch (error) {
//          return res.status(500).json({message:`failed to verify Razorpay payment ${error}`})
//     }
// }

import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto";
import mongoose from "mongoose";

// Plans are defined on the server.
// Never trust prices or credit amounts sent by the frontend.
const PLANS = {
  basic: { amount: 100, credits: 150 },
  pro: { amount: 500, credits: 650 },
};

// Create a Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Please sign in first" });
    }

    const plan = PLANS[planId];

    if (!plan) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    if (!razorpay) {
      return res.status(503).json({
        message: "Payment service is unavailable",
      });
    }

    const order = await razorpay.orders.create({
      amount: plan.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    await Payment.create({
      userId,
      planId,
      amount: plan.amount,
      credits: plan.credits,
      razorpayOrderId: order.id,
      status: "created",
    });

    return res.status(200).json(order);
  } catch (error) {
    console.error("Create order error:", error.message);

    return res.status(500).json({
      message: "Failed to create payment order",
    });
  }
};

// Verify payment and add credits exactly once
export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Please sign in first" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: "Missing payment verification details",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET || !razorpay) {
      return res.status(503).json({
        message: "Payment service is unavailable",
      });
    }

    // Verify the signature using the server-side secret.
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest();

    let receivedSignature;

    try {
      receivedSignature = Buffer.from(razorpay_signature, "hex");
    } catch {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    if (
      receivedSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(expectedSignature, receivedSignature)
    ) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    // The order must belong to the currently signed-in user.
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      userId,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment order not found for this account",
      });
    }

    // Use server-defined plan values, not client-supplied values.
    const plan = PLANS[payment.planId];

    if (
      !plan ||
      payment.amount !== plan.amount ||
      payment.credits !== plan.credits
    ) {
      return res.status(400).json({
        message: "Payment plan details are invalid",
      });
    }

    // Check with Razorpay that this payment actually succeeded
    // and belongs to the expected order.
    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

    if (razorpayPayment.order_id !== razorpay_order_id) {
      return res.status(400).json({
        message: "Payment does not match the order",
      });
    }

    if (razorpayPayment.status !== "captured") {
      return res.status(400).json({
        message: "Payment has not been captured",
      });
    }

    if (razorpayPayment.amount !== plan.amount * 100) {
      return res.status(400).json({
        message: "Payment amount does not match the plan",
      });
    }

    if (razorpayPayment.currency !== "INR") {
      return res.status(400).json({
        message: "Payment currency does not match",
      });
    }

    let alreadyProcessed = false;
    let updatedUser = null;

    // Update the payment and user credits atomically.
    // Concurrent requests cannot both successfully credit the same order.
    await session.withTransaction(async () => {
      const currentPayment = await Payment.findOne({
        _id: payment._id,
        userId,
      }).session(session);

      if (!currentPayment) {
        throw new Error("PAYMENT_NOT_FOUND");
      }

      if (currentPayment.status === "paid") {
        alreadyProcessed = true;
        updatedUser = await User.findById(userId).session(session);
        return;
      }

      const updateResult = await Payment.updateOne(
        {
          _id: currentPayment._id,
          userId,
          status: "created",
        },
        {
          $set: {
            status: "paid",
            razorpayPaymentId: razorpay_payment_id,
          },
        },
        { session },
      );

      if (updateResult.modifiedCount !== 1) {
        throw new Error("PAYMENT_ALREADY_PROCESSED");
      }

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { credits: plan.credits } },
        { new: true, session },
      );

      if (!updatedUser) {
        throw new Error("USER_NOT_FOUND");
      }
    });

    return res.status(200).json({
      success: true,
      message: alreadyProcessed
        ? "Payment was already processed"
        : "Payment verified and credits added",
      alreadyProcessed,
      user: updatedUser,
    });
  } catch (error) {
    if (
      error.message === "PAYMENT_ALREADY_PROCESSED" ||
      error.message === "PAYMENT_NOT_FOUND"
    ) {
      return res.status(409).json({
        message: "Payment is already being processed or could not be found",
      });
    }

    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }

    console.error("Verify payment error:", error.message);

    return res.status(500).json({
      message: "Failed to verify payment",
    });
  } finally {
    await session.endSession();
  }
};
