import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxios from "../../../../hooks/useAxios";
import { Navigate, useNavigate } from "react-router";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
const AddTask = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [uploading, setUploading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const axios = useAxios();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: userInfo = {}, refetch } = useQuery({
    queryKey: ["user-coins", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });
  console.log(userInfo);
  const onSubmit = async (data) => {
    // Image Check
    if (!imageURL) {
      toast.error("Please upload an image before submitting.");
      return;
    }

    // Parse & Calculate Cost
    const requiredWorkers = parseInt(data.required_workers);
    const payableAmount = parseFloat(data.payable_amount);
    const totalCost = requiredWorkers * payableAmount;

    //  Check Coin Balance
    if (userInfo.coin < totalCost) {
      toast.error("❌ You don't have enough coins to add this task.");
      return;
    }

    //  Prepare Task Data
    const taskData = {
      ...data,
      required_workers: requiredWorkers,
      payable_amount: payableAmount,
      task_image_url: imageURL,
      creator_email: userInfo?.email,
      buyer_name: userInfo?.name || "N/A",
      buyer_email: userInfo?.email || "N/A",
    };

    try {
      //  Add Task to DB
      const taskRes = await axios.post("/tasks", taskData);

      if (taskRes.data?.insertedId) {
        //  Deduct Coins
        await axios.patch(`/users`, {
          email: user?.email,
          coins: -totalCost, // will be added (or deducted) in backend
        });

        toast.success(" Task added and coins deducted!");
        queryClient.invalidateQueries(["allUsers"]);
        reset();
        setImageURL("");
        refetch(); // Update coin UI
        navigate("/dashboard/myTasks");
      } else {
        toast.error("❌ Failed to add task.");
      }
    } catch (error) {
      console.error("Task submission error:", error);
      toast.error("❌ Failed to add task.");
    }
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    const uploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    setUploading(true);

    try {
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const imageUrl = data?.data?.url;

      if (imageUrl) {
        setImageURL(imageUrl);
        
      } else {
        toast.error("❌ Failed to get image URL!");
      }
    } catch (err) {
      console.error("Image upload failed", err);
      toast.error("❌ Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 shadow-md rounded-xl">
      <h2 className="text-2xl text-primary font-bold mb-4">Add New Task</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label >Task Title</label>
        <input
          type="text"
          placeholder="Task Title"
          {...register("task_title", { required: "Task title is required" })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {errors.task_title && (
          <p className="text-red-500">{errors.task_title.message}</p>
        )}
        <label >Task Details</label>
        <textarea
          placeholder="Task Details"
          {...register("task_detail", { required: "Task detail is required" })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {errors.task_detail && (
          <p className="text-red-500">{errors.task_detail.message}</p>
        )}

        {/* Image Upload */}
        <div>
          <label>Upload Task Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {uploading && (
            <p className="text-sm text-gray-500">Uploading image...</p>
          )}
        </div>

       <div className="flex gap-3">
         <div>
          <label>Required Workers</label>
          <input
            type="number"
            min="1"
            {...register("required_workers", { required: true })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label>Payable Amount (Per Worker)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("payable_amount", { required: true })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
       </div>

        <input
          type="date"
          {...register("completion_date", { required: true })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Submission Info"
          {...register("submission_info", { required: true })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <div className="flex items-center justify-center">
          <button
          type="submit"
          disabled={uploading}
          className="btn-primary btn border-none  text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Add Task
        </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
