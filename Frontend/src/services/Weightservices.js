import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api/',
})


export const getWeightHistory = async () => {
    const token = localStorage.getItem('token');
    const response = await API.get("/weights", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

export const addWeight = async (weightData) => {
    const token = localStorage.getItem('token');
    const response = await API.post("/weights", weightData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}



