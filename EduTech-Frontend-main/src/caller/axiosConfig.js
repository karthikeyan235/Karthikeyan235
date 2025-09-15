import axios from 'axios';

const getTokenAndID = () => {
    const userId = sessionStorage.getItem('user-id');
    const token = sessionStorage.getItem('token');
    const supertoken = sessionStorage.getItem('supertoken');
    const supId = sessionStorage.getItem('sup-id');
    const iid = sessionStorage.getItem('iid');
    return { userId, token, supertoken, supId, iid };
};

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND,
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        const { userId, token, supId, supertoken, iid } = getTokenAndID();
        if (userId, token) {
            config.headers['user-id'] = userId;
            config.headers['token'] = token;
        }
        if (supId, supertoken) {
            config.headers['sup-id'] = supId;
            config.headers['suptoken'] = supertoken;
        }
        if (iid) {
            config.headers['instituteId'] = iid; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
  
export default instance; 