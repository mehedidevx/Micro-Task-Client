import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import useAxios from "../../../hooks/useAxios";
import toast from "react-hot-toast";

const BuyerDashboard = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ["myTasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks?creator_email=${user.email}`);
      return res.data;
    },
  });

  // Fetch pending submissions
  const { data: submissions = [] } = useQuery({
    queryKey: ["buyerSubmissions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/submissions?buyer_email=${user.email}`
      );
      return res.data.submissions.filter((sub) => sub.status === "pending");
    },
    enabled: !!user?.email,
  });
  console.log(submissions);

  // ✅ Approve submission (new route used)
  // ✅ Approve submission (updated)
  const approveMutation = useMutation({
    mutationFn: async (submission) => {
      const res = await axiosSecure.patch(
        `/buyer/submissions/${submission._id}/approve`
      );
      return res.data;
    },

    onSuccess: async (_data, submission) => {
      toast.success("Submission approved successfully!");

      // ✅ Send notification
      await axiosSecure.post("/notifications", {
        worker_email: submission.worker_email,
        buyer_email: user.email,
        message: `Your submission for has been approved!`,
        title: submission.task_title,
        buyerName: submission.buyer_name,
        coin: submission.payable_amount,
        type: "task_approved",
        actionRoute: "/dashboard",
      });

      queryClient.invalidateQueries(["buyerSubmissions", user?.email]);
      queryClient.invalidateQueries(["myTasks", user?.email]);
    },

    onError: () => {
      toast.error("Failed to approve submission");
    },
  });

  // ❌ Reject submission
  const rejectMutation = useMutation({
    mutationFn: async ({ submissionId, taskId }) => {
      await axiosSecure.patch(`/buyer/submissions/${submissionId}/reject`, {
        taskId,
      });
    },
    onSuccess: () => {
      toast.success("Submission rejected!");
      queryClient.invalidateQueries(["buyerSubmissions", user?.email]);
    },
    onError: () => {
      toast.error("Failed to reject submission");
    },
  });
  const { data: approvedSubmissions = [] } = useQuery({
    queryKey: ["approvedSubmissions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/submissions?buyer_email=${user.email}&status=approved`
      );
      return res.data.submissions;
    },
  });
  const totalPaid = approvedSubmissions.reduce(
    (sum, sub) => sum + (sub.payable_amount || 0),
    0
  );
  console.log(approvedSubmissions);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">Welcome, Buyer</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#2fc2b3] text-white shadow">
          <h3 className="text-lg font-semibold">Total Tasks</h3>
          <p className="text-2xl">{tasks.length}</p>
        </div>
        <div className="bg-[#126159] text-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Pending Workers</h3>
          <p className="text-2xl">{submissions.length}</p>
        </div>
        <div className="bg-[#258da7] text-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Paid</h3>
          <p className="text-2xl">{totalPaid}</p>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="overflow-x-auto">
        <h3 className="text-xl font-semibold mb-2">Tasks To Review</h3>
        <table className="table">
          <thead className="bg-[#00BBA7] text-white">
            <tr>
              <th>Worker</th>
              <th>Task</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub._id} className="bg-[#17615a] text-white">
                <td>{sub.worker_name}</td>
                <td>{sub.task_title}</td>
                <td>{sub.payable_amount}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setOpen(true);
                    }}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => approveMutation.mutate(sub)} // ✅ full object পাঠাচ্ছেন
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() =>
                      rejectMutation.mutate({
                        submissionId: sub._id,
                        taskId: sub.task_id,
                      })
                    }
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submission Modal */}
      {selectedSubmission && (
        <Modal open={open} onClose={() => setOpen(false)} center>
          <h3 className="text-xl font-bold mb-2">Submission Detail</h3>
          <p>
            <strong>Worker:</strong> {selectedSubmission.worker_name}
          </p>
          <p>
            <strong>Task:</strong> {selectedSubmission.task_title}
          </p>
          <p>
            <strong>Details:</strong>{" "}
            {selectedSubmission.submission_details || "No additional detail"}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default BuyerDashboard;
