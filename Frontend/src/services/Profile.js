import API from "./api";

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getProfile = async () => {
  const response = await API.get("/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.patch("/profile", profileData);
  return response.data;
};