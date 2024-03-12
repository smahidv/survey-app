import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClient.interceptors.request.use((config) => {
    // The Authorization header is used to send the client’s credentials to the server 
    // when the client is attempting to access a protected resource.
    //  the server will then verify (token) before returning the requested resource.
// header : the third parameter to the axios.post() method
// the  token is added to the request 
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
