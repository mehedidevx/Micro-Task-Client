import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAxios from '../../../../hooks/useAxios';
import Loading from '../../../../components/Loading/Loading';


const TaskList = () => {
  const axiosSecure = useAxios();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['all-tasks'],
    queryFn: async () => {
      const res = await axiosSecure.get('/tasks');
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading></Loading>;
  }

  const availableTasks = tasks.filter(task => task.required_workers > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {availableTasks.map(task => (
        <div key={task._id} className="card bg-base-100 shadow-xl border border-primary">
          <div className="card-body">
            <h2 className="card-title text-primary">{task.task_title}</h2>
            <p><span className="font-semibold">Buyer:</span> {task.buyer_name}</p>
            <p><span className="font-semibold">Completion Date:</span> {task.completion_date}</p>
            <p><span className="font-semibold">Payable Amount:</span> {task.payable_amount}</p>
            <p><span className="font-semibold">Required Workers:</span> {task.required_workers}</p>
            <div className="card-actions justify-end mt-4">
              <Link to={`/dashboard/task-details/${task._id}`}>
                <button className="btn btn-primary btn-sm">View Details</button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
