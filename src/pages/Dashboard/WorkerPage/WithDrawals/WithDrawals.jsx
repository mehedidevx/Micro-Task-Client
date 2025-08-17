import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";
import Loading from "../../../../components/Loading/Loading";

const Withdrawals = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const [coinToWithdraw, setCoinToWithdraw] = useState(0);
  const [paymentSystem, setPaymentSystem] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // ✅ Fetch user data
  const { data: userData = {}, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  const totalCoins = userData?.coin || 0;
  const withdrawableAmount = (coinToWithdraw / 20).toFixed(2);
  const totalWithdrawableAmount = (totalCoins / 20).toFixed(2);

  // ✅ Withdraw + Coin Patch Mutation
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (coinToWithdraw > totalCoins) {
        throw new Error("❌ You don't have enough coins.");
      }

      // 1️⃣ Patch user coin (using negative value)
      await axiosSecure.patch("/users", {
        email: user.email,
        coins: -parseInt(coinToWithdraw),
      });

      // 2️⃣ Create withdrawal record
      const withdrawal = {
        worker_email: user.email,
        worker_name: user.displayName,
        withdrawal_coin: parseInt(coinToWithdraw),
        withdrawal_amount: parseFloat(withdrawableAmount),
        payment_system: paymentSystem,
        account_number: accountNumber,
        withdraw_date: new Date().toISOString(),
        status: "pending",
      };

      await axiosSecure.post("/withdrawals", withdrawal);
    },
    onSuccess: () => {
      Swal.fire("✅ Success", "Withdrawal request submitted!", "success");
      queryClient.invalidateQueries(["user", user?.email]);
      setCoinToWithdraw(0);
      setPaymentSystem("");
      setAccountNumber("");
    },
    onError: (err) => {
      Swal.fire("❌ Error", err.message || "Something went wrong.", "error");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mutateAsync();
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl dark:text-gray-950 font-bold text-center mb-4">Withdraw Coins</h2>

      <div className="mb-4 text-sm font-medium space-y-1">
        <p className="text-green-600">
          ✅ <span className="text-blue-600">Total Coins:</span> {totalCoins}
        </p>
        <p className="text-green-600">
          💰 <span className="text-green-600">Total Withdrawable:</span> $
          {totalWithdrawableAmount}
        </p>
      </div>

      {totalCoins >= 200 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Coin Input */}
          <div >
            <label className="label text-sm font-semibold dark:text-black">Coin to Withdraw:</label>
            <input
              type="number"
              min="200"
              max={totalCoins}
              value={coinToWithdraw}
              onChange={(e) => setCoinToWithdraw(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* USD Amount */}
          <div>
            <label className="label text-sm font-semibold dark:text-black">Withdraw Amount ($):</label>
            <input
              type="text"
              value={withdrawableAmount}
              readOnly
              className="input input-bordered w-full bg-gray-100 dark:text-black"
            />
          </div>

          {/* Payment System */}
          <div>
            <label className="label text-sm font-semibold dark:text-black">Payment System:</label>
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

          {/* Account Number */}
          <div>
            <label className="label text-sm font-semibold dark:text-black">Account Number:</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isPending || coinToWithdraw > totalCoins}
          >
            {isPending ? "Processing..." : "Withdraw"}
          </button>
        </form>
      ) : (
        <p className="text-red-600 text-center font-semibold mt-4">
          ⚠️ You need at least 200 coins to withdraw.
        </p>
      )}
    </div>
  );
};

export default Withdrawals;
