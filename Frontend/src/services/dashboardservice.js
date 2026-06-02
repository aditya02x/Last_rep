import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/',

});

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