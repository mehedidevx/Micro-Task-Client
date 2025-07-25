import React from "react";


import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading/Loading";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";

const WorkerDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  // Get all submissions by this worker
const { data = {} } = useQuery({
  queryKey: ["mySubmissions", user?.email],
  queryFn: async () => {
    const res = await axiosSecure.get(`/submissions?worker_email=${user.email}`);
    return res.data;
  },
  enabled: !!user?.email,
});

const submissions = data.submissions || [];



  const { data: withdrawals = [], isLoading } = useQuery({
    queryKey: ["myWithdrawals", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/withdrawals?worker_email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });


  // Calculations
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(
    (s) => s.status === "pending"
  ).length;
 const totalEarning = withdrawals
  .filter((s) => s.status === "approved") // approved submissions শুধু রাখে
  .reduce((sum, item) => sum + (item.
withdrawal_amount || 0), 0); // সব payable_amount যোগ করে
  console.log('total earnign', totalEarning)


  const approvedSubmissions = submissions.filter(
    (s) => s.status === "approved"
  );
  console.log(approvedSubmissions)
  if(isLoading){
    return <Loading></Loading>
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-6 text-primary">Welcome, Worker</h2>

      {/* States Summary */}
      <div className="grid grid-cols-1 text-white md:grid-cols-3 gap-4">
        <div className="bg-blue-600 p-4 rounded-xl shadow">
          <h4 className="text-xl font-semibold">Total Submissions</h4>
          <p className="text-2xl">{totalSubmissions}</p>
        </div>
        <div className="bg-yellow-600 p-4 rounded-xl shadow">
          <h4 className="text-xl font-semibold">Pending Submissions</h4>
          <p className="text-2xl">{pendingSubmissions}</p>
        </div>
        <div className="bg-green-600 p-4 rounded-xl shadow">
          <h4 className="text-xl font-semibold">Total Earning</h4>
          <p className="text-2xl">${totalEarning}</p>
        </div>
      </div>

      {/* Approved Submissions Table */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Approved Submissions</h3>
        <div className="overflow-x-auto">
          <table className="table w-full border border-gray-300">
            <thead>
              <tr className="bg-primary text-white">
                <th>#</th>
                <th>Task Title</th>
                <th>Payable Amount</th>
                <th>Buyer Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedSubmissions.map((sub, index) => (
                <tr key={sub._id}>
                  <td>{index + 1}</td>
                  <td>{sub.task_title}</td>
                  <td>{sub.payable_amount}</td>
                  <td>{sub.buyer_name}</td>
                  <td className="text-green-600 font-semibold">{sub.status}</td>
                </tr>
              ))}
              {approvedSubmissions.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No approved submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
