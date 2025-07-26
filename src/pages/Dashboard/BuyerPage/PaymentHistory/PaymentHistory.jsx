import React from "react";
import useAuth from "../../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

import Loading from "../../../../components/Loading/Loading";

import useAxios from "../../../../hooks/useAxios";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payment-history", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <Loading></Loading>
  }

  return (
    <div className="p-6  rounded-xl  text-white">
      <h2 className="text-3xl font-bold text-center mb-4 text-primary">🧾 Payment History</h2>

      {payments.length === 0 ? (
        <p>No payment history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border border-gray-300">
            <thead>
              <tr className="bg-primary text-white  text-left">
                <th className="p-2">#</th>
                <th className="p-2">Date</th>
                <th className="p-2">Coins</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment._id} className="border-t bg-[#1e756d] border-gray-700 hover:bg-gray-800">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{new Date(payment.date).toLocaleString()}</td>
                  <td className="p-2">{payment.coins}</td>
                  <td className="p-2 text-green-400">${(payment.amount / 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
