import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

import { FaTrash } from 'react-icons/fa';
import useAxios from '../../../../hooks/useAxios';

const ManageTasks = () => {
    const axiosSecure = useAxios();
    const queryClient = useQueryClient();

    // Get All Tasks
    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ['all-tasks'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tasks');
            return res.data;
        }
    });
    console.log(tasks)

    // Delete Task
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/tasks/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['all-tasks']);
            Swal.fire('Deleted!', 'Task has been deleted.', 'success');
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    if (isLoading) return <p className="text-center">Loading...</p>;

    return (
        <div className="overflow-x-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Manage Tasks</h2>
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Buyer Name</th>
                        <th>Title</th>
                        <th>Workers Needed</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={task._id}>
                            <td>{index + 1}</td>
                            <td>{task.buyer_name}</td>
                            <td>{task.task_title}</td>
                            <td>{task.required_workers}</td>
                            <td>{task.payable_amount}</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(task._id)}
                                    className="btn btn-sm btn-error"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageTasks;
