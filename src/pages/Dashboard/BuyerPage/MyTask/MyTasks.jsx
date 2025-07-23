import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import useAuth from "../../../../hooks/useAuth";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import useAxios from "../../../../hooks/useAxios";
import toast from "react-hot-toast";
import { useState } from "react";
import Modal from "react-modal";
import Loading from "../../../../components/Loading/Loading";

const MyTasks = () => {
  const { user } = useAuth();
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_workers: "",
    payable_amount: "",
  });
  const { data: tasks = [], isLoading }  = useQuery({
    queryKey: ["myTasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`/tasks?creator_email=${user.email}`);

      console.log(res.data);
      return res.data;
    },
  });
  console.log(tasks);
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const res = await axios.delete(`/tasks/${taskId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`🪙 ${data.refundAmount} coins refunded & task deleted`);
      queryClient.invalidateQueries(["myTasks"]);
      queryClient.invalidateQueries(["user-coins"]); // update coin in AddTask
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/tasks/${selectedTask._id}`, {
        task_title: formData.title,
        task_detail: formData.description,
        submission_info: formData.submission_Details,
      });

      toast.success("Task updated successfully");
      queryClient.invalidateQueries(["myTasks"]);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    }
  };
  if(isLoading){
    return <Loading></Loading>
  }

  return (
    <div>
      <div className="overflow-x-auto p-4">
        <table className="table w-full border border-gray-300">
          <thead className="">
            <tr className="bg-primary text-white">
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Required</th>
              <th>Payable</th>
              
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {tasks.map((task, idx) => (
              <tr key={task._id} className="hover bg-[#1f887d] text-white ">
                <td>{idx + 1}</td>
                <td>
                  <img
                    src={task.task_image_url}
                    alt="Task"
                    className="w-14 h-14 rounded object-cover"
                  />
                </td>
                <td>{task.task_title}</td>
                <td>{task.required_workers}</td>
                <td>{task.payable_amount}</td>
                
                <td>{task.completion_date}</td>
                <td className="flex items-center mt-3 gap-2">
                  <button
                    className="text-blue-600 btn btn-sm btn-outline btn-error tooltip"
                    onClick={() => {
                      setSelectedTask(task);
                      setFormData({
                        title: task.title,
                        description: task.description,
                        submission_Details: task.submission_Details || "",
                      });
                      setIsEditModalOpen(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error tooltip"
                    data-tip="Delete"
                    onClick={() => deleteTaskMutation.mutate(task._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tasks.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            You haven't created any task yet.
          </p>
        )}
      </div>
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Update Task Modal"
        className=" p-6 max-w-md mx-auto mt-20 rounded shadow-lg bg-white"
        overlayClassName="fixed inset-0 "
      >
        <h2 className="text-lg font-bold mb-4">Update Task</h2>
        <form onSubmit={handleUpdate} className="space-y-4 ">
          <div>
            <label className="block mb-1 text-sm font-medium">Title</label>
            <input
              type="text"
              
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Task Detail
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border p-2 rounded"
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Submission Details
            </label>
            <textarea
              rows="2"
              value={formData.submission_Details}
              onChange={(e) =>
                setFormData({ ...formData, submission_Details: e.target.value })
              }
              className="w-full border p-2 rounded"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyTasks;
