import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';



const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/dashboard'; // ✅ Redirect to dashboard after login

  const [loginError, setLoginError] = useState('');

  const onSubmit = data => {
    setLoginError(''); 
    signIn(data.email, data.password)
      .then(result => {
        console.log(result.user);
         toast.success('Login successful!');
        navigate(from, { replace: true });
      })
      .catch(error => {
        console.error(error);
        setLoginError('Invalid email or password.');
        toast.error('Login failed. Invalid email or password.');
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Email Field */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="input input-bordered w-full"
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

            {/* Password Field */}
            <label className="label mt-3">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className="input input-bordered w-full"
              placeholder="Enter password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

            {/* Login Error */}
            {loginError && <p className="text-red-600 mt-2">{loginError}</p>}

            {/* Forgot Password */}
            <div className="mt-2">
              <a href="#" className="link link-hover">Forgot password?</a>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full mt-4 text-white border-none">Login</button>
          </form>

          <p className="text-sm text-center mt-4">
            New to this website?{' '}
            <Link state={{ from }} className="link link-primary " to="/register">Register</Link>
          </p>

          {/* Google Login */}
          
          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default Login;
