import axios from 'axios';
import React from 'react';

import { useNavigate } from 'react-router';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL
});

const useAxiosSecure = () => {
    const { user, logOut, firebaseUser } = useAuth();
    const navigate = useNavigate();
    console.log(firebaseUser)

    axiosSecure.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${firebaseUser.accessToken}`
        return config;
    }, error => {
        return Promise.reject(error);
    })

    axiosSecure.interceptors.response.use(res => {
        return res;
    }, error => {
        const status = error.status;
        if (status === 403) {
            navigate('/forbidden');
        }
        else if (status === 401) {
            logOut()
                .then(() => {
                    navigate('/login')
                })
                .catch(() => { })
        }

        return Promise.reject(error);
    })


    return axiosSecure;
};

export default useAxiosSecure;