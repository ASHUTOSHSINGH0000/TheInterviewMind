import React, { useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../config";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import { setUserData } from "../redux/userSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const paymentOutcome = useRef("idle");
  const dispatch = useDispatch();

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "A starting balance for your first practice sessions.",
      features: [
        "100 credits included",
        "Technical or HR interviews",
        "Voice and text answers",
        "Score and feedback reports",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "A small top-up for continued interview practice.",
      features: [
        "150 credits added",
        "Technical or HR interviews",
        "Voice and text answers",
        "Score and feedback reports",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "A larger top-up for more practice sessions.",
      features: [
        "650 credits added",
        "Technical or HR interviews",
        "Voice and text answers",
        "Score and feedback reports",
      ],
      badge: "Best Value",
    },
  ];

  const handlePayment = async (plan) => {
    setPaymentError("");
    setPaymentMessage("");
    paymentOutcome.current = "open";
    try {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error("Razorpay checkout is not configured for this app.");
      }
      setLoadingPlan(plan.id);

      const amount = plan.id === "basic" ? 100 : plan.id === "pro" ? 500 : 0;

      const result = await axios.post(
        ServerUrl + "/api/payment/order",
        {
          planId: plan.id,
          amount: amount,
          credits: plan.credits,
        },
        { withCredentials: true },
      );

      const options = {
        key: razorpayKey,
        amount: result.data.amount,
        currency: "INR",
        name: "TheInterviewMind",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,
        handler: async function (response) {
          paymentOutcome.current = "verifying";
          setLoadingPlan(plan.id);
          try {
            const verifypay = await axios.post(
              ServerUrl + "/api/payment/verify",
              response,
              { withCredentials: true },
            );
            dispatch(setUserData(verifypay.data.user));
            paymentOutcome.current = "verified";
            setPaymentMessage(
              `${plan.credits} credits were added to your account.`,
            );
          } catch (error) {
            console.log(error);
            paymentOutcome.current = "failed";
            setPaymentError(
              "Payment verification failed. Your credits were not updated.",
            );
          } finally {
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: () => {
            setLoadingPlan(null);
            if (paymentOutcome.current === "open") {
              paymentOutcome.current = "cancelled";
              setPaymentMessage("Checkout closed. No payment was confirmed.");
            }
          },
        },
        theme: {
          color: "#F0002F",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        paymentOutcome.current = "failed";
        setPaymentError(
          response.error?.description || "Payment was not completed.",
        );
        setLoadingPlan(null);
      });
      rzp.open();
    } catch (error) {
      console.log(error);
      paymentOutcome.current = "failed";
      setPaymentError(
        error.response?.data?.message ||
          error.message ||
          "We could not start checkout. Please try again.",
      );
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 flex items-start gap-4">
            <button
              onClick={() => navigate("/")}
              className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition border border-slate-200"
            >
              <FaArrowLeft className="text-slate-600" />
            </button>

            <div className="w-full">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-700 font-medium">
                Pricing
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl text-slate-900">
                Credit bundles
              </h1>
              <p className="mt-2 text-slate-600 text-base">
                One-time purchases. Every interview session uses 50 credits.
              </p>
            </div>
          </div>

          {paymentError && (
            <p
              role="alert"
              className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {paymentError}
            </p>
          )}
          {paymentMessage && (
            <p
              role="status"
              className="mb-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
            >
              {paymentMessage}
            </p>
          )}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;

              return (
                <motion.article
                  key={plan.id}
                  whileHover={!plan.default ? { y: -6 } : {}}
                  onClick={() => !plan.default && setSelectedPlan(plan.id)}
                  aria-current={isSelected ? "true" : undefined}
                  className={`relative rounded-[28px] p-6 transition-all duration-300 border ${
                    isSelected
                      ? "border-emerald-500 shadow-[0_24px_60px_rgba(16,185,129,0.12)] bg-white"
                      : "border-slate-200 bg-white/90 shadow-[0_15px_40px_rgba(15,23,42,0.05)]"
                  } ${plan.default ? "cursor-default" : "cursor-pointer"}`}
                >
                  {plan.badge && (
                    <div className="absolute top-5 right-5 bg-emerald-500 text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-[0.14em]">
                      {plan.badge}
                    </div>
                  )}

                  {plan.default && (
                    <div className="absolute top-5 right-5 bg-slate-100 text-slate-600 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-[0.14em]">
                      Default
                    </div>
                  )}

                  <div className="mb-5">
                    <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <input
                        type="radio"
                        name="credit-plan"
                        value={plan.id}
                        checked={isSelected}
                        onChange={() => setSelectedPlan(plan.id)}
                        className="accent-red-600"
                        aria-label={`Select ${plan.name} credit bundle`}
                      />
                      {plan.default ? "Included balance" : "Credit bundle"}
                    </label>
                    <h2 className="mt-2 text-2xl text-slate-900">
                      {plan.name}
                    </h2>
                  </div>

                  <div className="mb-5">
                    <span className="text-4xl font-bold text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-slate-500 ml-1">/ pack</span>
                  </div>

                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-slate-700"
                      >
                        <FaCheckCircle className="text-emerald-500" size={14} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handlePayment(plan)}
                    disabled={loadingPlan !== null || plan.id === "free"}
                    className={`w-full rounded-md py-3 font-semibold transition ${
                      plan.id === "free"
                        ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {plan.id === "free"
                      ? "Included"
                      : loadingPlan === plan.id
                        ? "Processing..."
                        : "Upgrade plan"}
                  </button>
                </motion.article>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Pricing;
