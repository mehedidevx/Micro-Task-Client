import React, { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth";

import Loading from "../../../../components/Loading/Loading";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const Withdrawals = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [coinToWithdraw, setCoinToWithdraw] = useState(0);
  const [paymentSystem, setPaymentSystem] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // Get user's current coin
  const { data: userData = {}, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const totalCoins = userData?.coin || 0;
  const withdrawableAmount = (coinToWithdraw / 20).toFixed(2);
  const totalWithdrawableAmount = (totalCoins / 20).toFixed(2);

  // Mutation to submit withdrawal
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (withdrawData) => {
      const res = await axiosSecure.post("/withdrawals", withdrawData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Withdrawal request submitted!", "success");
      queryClient.invalidateQueries(["user-coins", user?.email]);
      setCoinToWithdraw(0);
      setPaymentSystem("");
      setAccountNumber("");
    },
  });
  if (isLoading) {
    return <Loading></Loading>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const withdrawal = {
      worker_email: user?.email,
      worker_name: user?.displayName,
      withdrawal_coin: parseInt(coinToWithdraw),
      withdrawal_amount: parseFloat(withdrawableAmount),
      payment_system: paymentSystem,
      account_number: accountNumber,
      withdraw_date: new Date().toISOString(),
      status: "pending",
    };
    await mutateAsync(withdrawal);
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4">Withdrawals</h2>
      <p className="mb-2 font-medium">
        Total Coins: <span className="text-blue-600">{totalCoins}</span>
      </p>
      <p className="mb-4 font-medium">
        Withdrawable Amount:{" "}
        <span className="text-green-600">${totalWithdrawableAmount}</span>
      </p>

      {totalCoins >= 200 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Coin To Withdraw:</label>
            <input
              type="number"
              min="0"
              max={totalCoins}
              value={coinToWithdraw}
              onChange={(e) => setCoinToWithdraw(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block">Withdraw Amount ($):</label>
            <input
              type="text"
              value={withdrawableAmount}
              readOnly
              className="input input-bordered w-full bg-gray-600"
            />
          </div>

          <div>
            <label className="block">Select Payment System:</label>
            <select
              value={paymentSystem}
              onChange={(e) => setPaymentSystem(e.target.value)}
              className="select select-bordered w-full"
              required
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="Bkash">Bkash</option>
              <option value="Rocket">Rocket</option>
              <option value="Nagad">Nagad</option>
              <option value="Upay">Upay</option>
            </select>
          </div>

          <div>
            <label className="block">Account Number:</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isPending || coinToWithdraw > totalCoins}
          >
            {isPending ? "Submitting..." : "Withdraw"}
          </button>
        </form>
      ) : (
        <p className="text-red-600 font-semibold text-center">
          Insufficient coin
        </p>
      )}
    </div>
  );
};

export default Withdrawals;
