import API from "./api";

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
    }
    return req;
}

);

export const getDashboard = async ()=>{
    const response = await API.get('/dashboard');
    return response.data;
}