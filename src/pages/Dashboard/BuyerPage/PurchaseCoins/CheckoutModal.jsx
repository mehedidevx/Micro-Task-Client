import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";

const CheckoutModal = ({ open, setOpen, selectedPackage }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    // You should call your backend to create a PaymentIntent here
    const res = await fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: selectedPackage.price * 100 }),
    });
    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    setLoading(false);
    if (result.error) {
      toast.error(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");
      setOpen(false);
      // TODO: Backend এ 
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      center
      classNames={{ modal: "bg-gray-800 rounded-xl p-6 w-full max-w-md" }}
    >
      {selectedPackage && (
        <div className="text-center text-white space-y-4">
          <h2 className="text-3xl font-bold text-blue-400">Confirm Purchase</h2>

          <div className="flex justify-between items-center bg-gray-700 rounded-lg px-4 py-3">
            <span className="text-lg font-medium">🪙 Coins</span>
            <span className="text-xl font-semibold">{selectedPackage.coins}</span>
          </div>

          <div className="flex justify-between items-center bg-gray-700 rounded-lg px-4 py-3">
            <span className="text-lg font-medium">💵 Price</span>
            <span className="text-xl font-semibold">${selectedPackage.price}</span>
          </div>

          <div className="bg-gray-900 rounded-lg px-4 py-3 text-left">
            <CardElement
              className="p-2 rounded text-white"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#fff",
                    "::placeholder": { color: "#aaa" },
                  },
                  invalid: { color: "#ff6b6b" },
                },
              }}
            />
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition duration-200 disabled:opacity-50"
            onClick={handlePayment}
            disabled={!stripe || loading}
          >
            {loading ? "Processing..." : `Pay $${selectedPackage.price}`}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default CheckoutModal;
