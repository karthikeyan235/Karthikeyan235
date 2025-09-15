import axios from 'axios';

const API = import.meta.env.VITE_FASTAPI;

const handleResponseError = (error) => {
    if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
            sessionStorage.removeItem('user-id');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('supertoken');
            sessionStorage.removeItem('sup-id');
            sessionStorage.removeItem('iid');
            sessionStorage.removeItem('instituteName');
            sessionStorage.removeItem('role');
            setTimeout(() => {
                window.location.href='/home';
            }, 1000);
            throw Object.assign(new Error(`Status ${status}: ${data.message}`), { statusCode: 401 });
        } else if (status === 404 && !data.message) {
            throw new Error(`Status ${status}: (Not Found) Incorrect API call - ${error}`);
        } else if (data.message) {
            throw new Error(`Status ${status}: ${data.message}`);
        } else {
            throw new Error(`Status ${status}: ${data.detail}`);
        }
    } else if (error.request) {
        throw new Error(`No response received: Network Error (Couldn't connect to the server)`);
    } else {
        throw new Error(`Client error: Error setting up the request - ${error}`);
    }
};

const getAPI = async (path) => {
    try {
        const response = await axios.get(`${API}${path}`);
        return response.data;
    } catch (error) {
        handleResponseError(error);
    }
};

const postAPI = async (path, data) => {
    try {
        const response = await axios.post(`${API}${path}`, data);
        return response.data;
    } catch (error) {
        handleResponseError(error);
    }
};

const postAPIMedia = async (path, formData) => {
    try {
        const response = await axios.post(`${API}${path}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.json) return response.json();
        return response.data;
    } catch (error) {
        handleResponseError(error);
    }
};

const imageFetchURL = async (path) => {
    try {
        const response = await axios.get(`${API}${path}`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        handleResponseError(error);
    }
}

export { getAPI, postAPI, postAPIMedia, imageFetchURL };