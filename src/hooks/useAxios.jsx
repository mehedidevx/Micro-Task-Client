import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://micro-task-platform-server.vercel.app`
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;