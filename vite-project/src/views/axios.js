import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClient.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('TOkEN')}`;
    return config;
});

axiosClient.interceptors.request.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.status === 401) {
            localStorage.removeItem('TOkEN');
            window.location.reload();
            // router.navigate('/login')
            return error;
        }
        throw error;
    }
);

export default axiosClient;
