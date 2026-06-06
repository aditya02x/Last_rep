import API from "./api";
export const loginUser = async (userData) => {
    const response = await API.post("/auth/login", userData);
  return response.data;
}

export const registerUser = async (userData)=>{
    const response = await API.post("/auth/register", userData);
    return response.data;
}


export const getProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await API.get("/users/profile", {  // adjust route if different
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}