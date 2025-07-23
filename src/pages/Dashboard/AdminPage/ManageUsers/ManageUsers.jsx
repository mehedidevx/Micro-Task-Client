import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxios from '../../../../hooks/useAxios';

const ManageUsers = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  // ✅ Load all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    }
  });

  // ✅ Remove user mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      Swal.fire('Deleted!', 'User has been deleted.', 'success');
    }
  });

  // ✅ Update role mutation
  const roleMutation = useMutation({
    mutationFn: async ({ id, newRole }) => {
      return await axiosSecure.patch(`/users/${id}/role`, { role: newRole });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      Swal.fire('Success', 'User role updated successfully', 'success');
    }
  });

  const handleRemove = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleRoleChange = (id, newRole) => {
    roleMutation.mutate({ id, newRole });
  };

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Coin</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={user.photo || 'https://via.placeholder.com/40'}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td>{user.name || 'N/A'}</td>
              <td>{user.email}</td>
              <td>{user.coin || 0}</td>
              <td className="capitalize">{user.role}</td>
              <td>
                <select
                  className="select select-bordered select-sm"
                  defaultValue={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option  defaultValue={user.role} value="Admin">Admin</option>
                  <option value="Buyer">Buyer</option>
                  <option value="Worker">Worker</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => handleRemove(user._id)}
                  className="btn btn-sm btn-error"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
