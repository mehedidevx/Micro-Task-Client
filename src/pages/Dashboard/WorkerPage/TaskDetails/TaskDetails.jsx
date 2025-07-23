import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxios from '../../../../hooks/useAxios';
import useAuth from '../../../../hooks/useAuth';

const TaskDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const [submissionDetails, setSubmissionDetails] = useState('');
  const navigate = useNavigate();

  // Fetch task info
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks/${id}`);
      return res.data;
    },
  });

  // Check if already submitted by this user for this task
  const { data: alreadySubmitted = false } = useQuery({
    queryKey: ['submission-check', id, user?.email],
    enabled: !!user?.email && !!id,
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions/check?taskId=${id}&email=${user.email}`);
      return res.data.exists; // server থেকে true/false আসবে
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (alreadySubmitted) {
      Swal.fire('Warning', 'You have already submitted this task.', 'warning');
      return;
    }

    const submission = {
      task_id: task._id,
      task_title: task.task_title,
      payable_amount: task.payable_amount,
      worker_email: user.email,
      worker_name: user.displayName,
      submission_details: submissionDetails,
      buyer_name: task.buyer_name || "N/A",
      buyer_email: task.buyer_email || "N/A",
      current_date: new Date().toISOString(),
      status: 'pending',
    };

    try {
      const res = await axiosSecure.post('/submissions', submission);
      if (res.data.insertedId) {
        Swal.fire('Success!', 'Submission sent for review.', 'success');
        setSubmissionDetails('');
        navigate('/dashboard/mySubmissions')
        
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Submission failed.', 'error');
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-base-100 rounded-xl shadow-lg space-y-6">
  <h2 className="text-3xl font-bold text-primary text-center">Task Details</h2>

  <div className="rounded-xl overflow-hidden border border-base-300">
    <img
      className="w-full h-64 object-cover"
      src={task?.task_image_url}
      alt="Task Image"
    />
    <div className="p-5 space-y-2 bg-base-200">
      <h3 className="text-xl font-semibold">{task?.task_title}</h3>
      <p>
        <span className="font-medium">Required Workers:</span>{" "}
        {task?.required_workers}
      </p>
      <p>
        <span className="font-medium">Payable Amount:</span>{" "}
        {task?.payable_amount} Coins
      </p>
      <p>
        <span className="font-medium">Completion Date:</span>{" "}
        {task?.completion_date}
      </p>
      <p>
        <span className="font-medium">Description:</span>{" "}
        {task?.task_detail || "No description provided."}
      </p>
    </div>
  </div>

  {alreadySubmitted ? (
    <div className="alert alert-warning shadow-sm text-sm">
      ✅ You have already submitted this task.
    </div>
  ) : (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-base-200 rounded-xl shadow space-y-4"
    >
      <label className="block text-base font-medium">
        Submission Details:
      </label>
      <textarea
        className="textarea textarea-bordered w-full h-32"
        required
        placeholder="Enter your work details..."
        value={submissionDetails}
        onChange={(e) => setSubmissionDetails(e.target.value)}
      ></textarea>

      <button type="submit" className="btn btn-primary w-full">
        Submit Work
      </button>
    </form>
  )}
</div>

  );
};

export default TaskDetails;
