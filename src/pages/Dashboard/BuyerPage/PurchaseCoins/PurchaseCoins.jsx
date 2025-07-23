import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import React from 'react';
import PurchaseCard from './PurchaseCard';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const PurchaseCoins = () => {

  return (
    <div>
      <Elements stripe={stripePromise}>
          <PurchaseCard></PurchaseCard>
      </Elements>
    </div>
  );
};

export default PurchaseCoins;