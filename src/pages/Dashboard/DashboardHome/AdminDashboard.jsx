import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaCheck } from 'react-icons/fa';
import useAxios from '../../../hooks/useAxios';
import Loading from '../../../components/Loading/Loading';

const AdminDashboard = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  // Fetch admin stats
// Fetch admin stats
const { data: stats = {}, isLoading: statsLoading } = useQuery({
  queryKey: ['adminStats'],
  queryFn: async () => {
    const [usersRes, tasksRes] = await Promise.all([
      axiosSecure.get('/users'),
      axiosSecure.get('/tasks'),
    ]);

    const users = usersRes.data || [];
    const tasks = tasksRes.data || [];

    const totalWorkers = users.filter(user => user.role === 'Worker').length;
    const totalBuyers = users.filter(user => user.role === 'Buyer').length;
    console.log(tasks)
    const totalTaskCoins = tasks.reduce((sum, task) => sum + (task.required_workers * task.payable_amount), 0);
  const totalPayments = tasks.reduce((sum, task) => sum + (task.payment_amount || 0), 0);

    return {
      totalWorkers,
      totalBuyers,
      totalTaskCoins,
      totalPayments,
    };
  },
});


  // Fetch withdrawal requests
const { data: withdrawRequests = [], isLoading: requestsLoading } = useQuery({
  queryKey: ['withdrawRequests'],
  queryFn: async () => {
    const res = await axiosSecure.get('/admin/withdraw-requests');
    return res.data;
  },
});
  // Mutation to approve withdrawal requests
const approveMutation = useMutation({
  mutationFn: async ({ id, email }) => {
    await axiosSecure.patch(`/admin/withdraw-requests/${id}/approve`, { email });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['withdrawRequests'] });
    queryClient.invalidateQueries({ queryKey: ['adminStats'] });
  },
});

  if (statsLoading || requestsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loading></Loading>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-3xl font-bold mb-6">Welcome, Admin</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
        <div className="bg-base-200 p-6 rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Total Workers</h3>
          <p className="text-3xl font-bold">{stats.totalWorkers ?? 0}</p>
        </div>
        <div className="bg-base-200 p-6 rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Total Buyers</h3>
          <p className="text-3xl font-bold">{stats.totalBuyers ?? 0}</p>
        </div>
        <div className="bg-base-200 p-6 rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Total Coins</h3>
          <p className="text-3xl font-bold">{stats.totalTaskCoins ?? 0}</p>
        </div>
        <div className="bg-base-200 p-6 rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Total Payments</h3>
          <p className="text-3xl font-bold">${stats.totalPayments?.toFixed(2) ?? '0.00'}</p>
        </div>
      </div>

      {/* Withdrawal Requests Table */}
      <div className="overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Withdrawal Requests</h3>
        <table className="table w-full">
          <thead>
            <tr>
              <th>User Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {withdrawRequests.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No withdrawal requests found.
                </td>
              </tr>
            )}
            {withdrawRequests.map((req) => (
              <tr key={req._id}>
                <td>{req.worker_email || req.email}</td>
                <td>${req.withdrawal_amount ?? req.amount}</td>
                <td className={`${req.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </td>
                <td>
                  {req.status === 'pending' ? (
                    <button
                      onClick={() => approveMutation.mutate({ id: req._id, email: req.worker_email || req.email })}
                      className="btn btn-sm btn-success flex items-center gap-2"
                      disabled={approveMutation.isLoading}
                    >
                      <FaCheck /> Payment Success
                    </button>
                  ) : (
                    <span className="text-gray-500">Approved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
