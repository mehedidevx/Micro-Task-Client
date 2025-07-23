import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";
import { useQueryClient } from "@tanstack/react-query";


const PaymentForm = ({ selectedPackage, closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const axiosSecure = useAxios();
   const queryClient = useQueryClient();
  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    

    try {
      // ✅ Create payment intent using axiosSecure
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount: selectedPackage.price * 100,
      });

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      setLoading(false);

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        await axiosSecure.post("/payments", {
          email: user.email,
          coins: selectedPackage.coins,
          amount: selectedPackage.price * 100,
          date: new Date(),
        });
        await axiosSecure.patch("/users", {
          email: user.email,
          coins: selectedPackage.coins,
        });
        queryClient.invalidateQueries(["allUsers"]);
        toast.success("Payment successful!");
        closeModal();
        // TODO: Update user coins in DB
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-primary text-center">
        Confirm Purchase
      </h2>

      <div className="flex justify-between items-center bg-gray-600 rounded-lg px-4 py-3">
        <span className="text-lg">🪙 Coins</span>
        <span className="text-xl font-semibold">{selectedPackage.coins}</span>
      </div>

      <div className="flex justify-between items-center bg-gray-600 rounded-lg px-4 py-3">
        <span className="text-lg">💵 Price</span>
        <span className="text-xl font-semibold">${selectedPackage.price}</span>
      </div>

      <div className="bg-gray-600 rounded-lg px-4 py-3">
        <CardElement
          className="p-2"
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#ffffff",
                "::placeholder": { color: "#ffffff" },
              },
              invalid: {
                color: "#ff6b6b",
              },
            },
          }}
        />
      </div>

      <button
        onClick={handlePayment}
        disabled={!stripe || loading}
        className="w-full btn btn-primary border-none text-white font-semibold py-2 rounded-full transition duration-200 disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${selectedPackage.price}`}
      </button>
    </div>
  );
};

export default PaymentForm;
