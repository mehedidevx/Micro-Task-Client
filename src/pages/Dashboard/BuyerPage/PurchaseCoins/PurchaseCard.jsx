import React, { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PurchaseForm";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const PurchaseCard = () => {
  const coinPackages = [
    { coins: 10, price: 1 },
    { coins: 150, price: 10 },
    { coins: 500, price: 20 },
    { coins: 1000, price: 35 },
  ];

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [open, setOpen] = useState(false);

  const handleCardClick = (pkg) => {
    setSelectedPackage(pkg);
    setOpen(true);
  };

  return (
   <div className="max-w-6xl mx-auto px-4 py-10">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
    Choose Your Coin Package
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {coinPackages.map((pkg) => (
      <div
        key={pkg.coins}
        className="rounded-xl bg-gradient-to-br bg-primary  text-white shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer text-center p-6"
        onClick={() => handleCardClick(pkg)}
      >
        <h3 className="text-2xl font-bold mb-2">{pkg.coins} Coins</h3>
        <p className="text-xl font-semibold">${pkg.price}</p>
      </div>
    ))}
  </div>

  {/* Modal */}
  <Modal
    open={open}
    onClose={() => setOpen(false)}
    center
    classNames={{
      modal: "bg-gray-900 text-white rounded-xl p-6 w-full max-w-md",
    }}
  >
    {selectedPackage && (
      <Elements stripe={stripePromise}>
        <PaymentForm
          selectedPackage={selectedPackage}
          closeModal={() => setOpen(false)}
        />
      </Elements>
    )}
  </Modal>
</div>

  );
};

export default PurchaseCard;
