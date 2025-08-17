import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const BrowseTask = () => {
  const axios = useAxios();

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("/tasks");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-10 text-gray-500">
        Loading tasks...
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center py-10 text-red-500">
        Failed to load tasks.
      </div>
    );

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="  rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        >
          <div className="h-48 w-full overflow-hidden">
            <img
              src={task.task_image_url || "/default-task.png"}
              alt={task.task_title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg text-primary font-semibold mb-2 truncate">{task.task_title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-3">{task.task_detail}</p>
            <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 font-medium">
              <span>Workers Needed: {task.required_workers}</span>
              <span>Coins: {task.payable_amount}</span>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-300">
              Deadline: {new Date(task.completion_date).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrowseTask;
