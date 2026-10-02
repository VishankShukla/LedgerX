import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        err.userMessage = err.response?.data?.message || (err.response ? "Something went wrong" : "Server not reachable");
        if(err.response?.status == 401 && !err.config.url.includes("/auth/")){
            window.dispatchEvent( new Event ("auth:expired"));
        }
        return Promise.reject(err);
    }
)

export default api;