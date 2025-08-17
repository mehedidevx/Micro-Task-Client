import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const MyProfileName = () => {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");
  const [preview, setPreview] = useState(user?.photoURL || "");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = () => {
    // এখানে firebase বা backend call করে update করার কাজ করতে পারো
    console.log("Name:", name);
    console.log("Photo:", photo);
    setOpen(false);
  };

  return (
    <div className="p-6  shadow-lg rounded-xl max-w-md mx-auto mt-8 text-center">
      <img
        src={user?.photoURL || "https://i.ibb.co/2kR4p1V/avatar.png"}
        alt="Profile"
        className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-4 border-indigo-200"
      />
      <h2 className="text-2xl font-semibold text-gray-700">
        {user?.displayName || "User Name Not Available"}
      </h2>
      <p className="text-gray-700">{user?.email}</p>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 cursor-pointer btn-primary  text-white px-4 py-2 rounded-lg"
      >
        Edit Profile
      </button>

      {/* Modal */}
      <Modal
        classNames={{
          modal: "bg-black text-white rounded-lg p-6",
        }}
        open={open}
        onClose={() => setOpen(false)}
        center
      >
        <div className="p-4">
          <h3 className="text-lg text-black font-bold mb-4">Update Profile</h3>

          <div className="mb-4">
            <label className="block text-black mb-1 text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md text-gray-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 text-sm font-medium">
              Profile Photo
            </label>
            <input
              className="text-gray-800"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 mt-2 rounded-full object-cover mx-auto"
              />
            )}
          </div>

          <button
            onClick={handleUpdate}
            className="mt-4 w-full btn-primary  text-gray-700 px-4 py-2 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MyProfileName;
