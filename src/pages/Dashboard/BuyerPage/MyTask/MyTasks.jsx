import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAxios from "../../../../hooks/useAxios";
import toast from "react-hot-toast";
import { useState } from "react";
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
    submission_details: "",
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["myTasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`/tasks?creator_email=${user.email}`);
      return res.data;
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const res = await axios.delete(`/tasks/${taskId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`🪙 ${data.refundAmount} coins refunded & task deleted`);
      queryClient.invalidateQueries(["myTasks"]);
      queryClient.invalidateQueries(["user-coins"]);
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
        submission_info: formData.submission_details,
      });

      toast.success("Task updated successfully");
      queryClient.invalidateQueries(["myTasks"]);
      setIsEditModalOpen(false);
    } catch (error) {
      console.log(error)
      toast.error("Failed to update task");
    }
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.task_title || "",
      description: task.task_detail || "",
      submission_details: task.submission_details || "",
    });
    setIsEditModalOpen(true);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="table w-full border border-gray-300">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Required</th>
              <th>Payable</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr key={task._id} className="hover bg-[#1f887d] text-white">
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
                    className="text-blue-600 btn btn-sm btn-outline btn-warning"
                    onClick={() => openEditModal(task)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
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

      {/* Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Update Task</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Title</label>
                <input
                  type="text"
                  defaultValue={selectedTask.task_title}
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
                  defaultValue={selectedTask.task_detail}
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
                  defaultValue={selectedTask.submission_details}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      submission_details: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
