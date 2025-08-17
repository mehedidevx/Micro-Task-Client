import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import useAxios from "../../../hooks/useAxios";
import SocialLogin from "../SocialLogin/SocialLogin";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const axiosInstance = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/dashboard";
  const queryClient = useQueryClient();

  const onSubmit = async (data) => {
    setErrorMsg("");

    try {
      const result = await createUser(data.email, data.password);
      console.log(result);

      // set user profile
      await updateUserProfile({
        displayName: data.name,
        photoURL: profilePic,
      });

      // calculate coins
      let coin = 0;
      if (data.role === "Worker") coin = 10;
      if (data.role === "Buyer") coin = 50;

      // prepare userInfo
      const userInfo = {
        name: data.name,
        email: data.email,
        photo: profilePic,
        role: data.role,
        coin,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      // store to database
      const res = await axiosInstance.post("/users", userInfo);
      if (res.data.insertedId) {
        queryClient.invalidateQueries({ queryKey: ["allUsers"] });
        toast.success("Registration successful! Redirecting...");
        navigate(from);
      }
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setErrorMsg("This email is already registered.");
        toast.error("This email is already registered.");
      } else {
        setErrorMsg(error.message);
        toast.error(error.message);
      }
    }
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    const uploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    try {
      const res = await axios.post(uploadUrl, formData);
      setProfilePic(res.data.data.url);
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  return (
    <div className="card bg-base-100 w-full my-20 max-w-sm mx-auto shadow-2xl">
      <div className="card-body">
        <h1 className="text-3xl font-bold text-center">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <label className="label">Your Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="input input-bordered w-full"
            placeholder="Your Name"
          />
          {errors.name && <p className="text-red-500">Name is required</p>}

          {/* Profile Pic */}
          <label className="label">Profile Picture</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />

          {/* Email */}
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", {
              required: true,
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                message:
                  "Only lowercase emails are allowed, e.g., exampleemail@gmail.com",
              },
            })}
            className="input input-bordered w-full"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          {/* Password */}
          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: 6,
              pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/,
            })}
            className="input input-bordered w-full"
            placeholder="Password"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-500">Password is required</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500">Password must be 6 characters long</p>
          )}
          {errors.password?.type === "pattern" && (
            <p className="text-red-500">
              Password must contain uppercase, lowercase, and number
            </p>
          )}

          {/* Role Select */}
          <label className="label">Select Role</label>
          <select
            {...register("role", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Choose role</option>
            <option value="Worker">Worker</option>
            <option value="Buyer">Buyer</option>
          </select>
          {errors.role && <p className="text-red-500">Role is required</p>}

          {/* Error */}
          {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}

          {/* Submit */}
          <button className="btn border-none btn-primary w-full mt-4">Register</button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link className="text-blue-500 underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
