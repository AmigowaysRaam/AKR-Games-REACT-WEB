import axios from "axios";
const API = axios.create({
  baseURL: "https://akrlottery.com/api",
});
// ✅ Add TOKEN automatically to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // always fresh
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// ✅ Maintenance Redirect
const handleMaintenanceRedirect = () => {
  if (window.location.pathname !== "/maintenance") {
    window.location.href = "/maintenance";
  }
};
// ✅ Response Interceptor
API.interceptors.response.use(
  (response) => {
    console.log(response, "API Response");
    if (response?.data?.maintenance === true) {
      handleMaintenanceRedirect();
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 503) {
      handleMaintenanceRedirect();
    }
    return Promise.reject(error);
  }
);

export default API;