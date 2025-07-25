import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";
import Loading from "../../../../components/Loading/Loading";

const MySubmission = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const [open, setOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const { data, isLoading,  } = useQuery({
    queryKey: ["mySubmissions", user?.email, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/submissions?worker_email=${user?.email}&page=${currentPage}&limit=${limit}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });
  
  const submissions = data?.submissions || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const openModal = (submission) => {
    setSelectedSubmission(submission);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedSubmission(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Submissions</h2>

      {isLoading ? (
        <Loading></Loading>
      ) : submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <div className="overflow-x-auto  rounded shadow">
          <table className="table w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th>Task Title</th>
                <th>Payable</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={submission._id}>
                  <td>{(currentPage - 1) * limit + index + 1}</td>
                  <td>{submission.task_title}</td>
                  <td>{submission.payable_amount} coins</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                        submission.status === "pending"
                          ? "bg-yellow-500"
                          : submission.status === "approved"
                          ? "bg-green-600"
                          : "bg-red-500"
                      }`}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td>
                    {new Date(submission.current_date).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() => openModal(submission)}
                      className="btn btn-xs bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              className="btn btn-sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="btn btn-sm btn-ghost">{currentPage}</span>
            <button
              className="btn btn-sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal open={open} onClose={closeModal} center>
        <h3 className="text-xl font-bold mb-2">Submission Detail</h3>
        {selectedSubmission && (
          <div className="space-y-2 text-sm text-black">
            <p>
              <strong>Task Title:</strong> {selectedSubmission.task_title}
            </p>
            <p>
              <strong>Description:</strong> {selectedSubmission.description}
            </p>
            <p>
              <strong>Submitted On:</strong>{" "}
              {new Date(selectedSubmission.current_date).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">{selectedSubmission.status}</span>
            </p>
            <p>
              <strong>Evidence:</strong>{" "}
              <a
                href={selectedSubmission.submission_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Link
              </a>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MySubmission;
