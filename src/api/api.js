import axios from "axios";

const API = axios.create({
  baseURL: "https://akrlottery.com/api",
});

/* ---------------- REQUEST ---------------- */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
const handleMaintenanceRedirect = () => {
  if (window.location.pathname !== "/maintenance") {
    window.location.href = "/maintenance";
  }
};
const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/Login";
};
const handleServerDown = () => {
  if (window.location.pathname !== "/server-down") {
    window.location.href = "/server-down";
  }
};

API.interceptors.response.use(
  (response) => {
    if (response.status == 200 && !response.data || response.data == '') {
      handleServerDown();
    }
    if (response?.data?.maintenance === true) {
      handleMaintenanceRedirect();
    }
    if (response?.data?.message === "Invalid token") {
      handleLogout();
    }
    return response;
  },
  (error) => {
    alert(JSON.stringify(error));
    if (!error.response) {
      console.error("Server Down / Network Error:", error.message);
      handleServerDown(); // ✅ redirect to server-down screen
      return Promise.reject(error);
    }
    const { status, data } = error.response;
    switch (status) {
      case 400:
        console.warn("Bad Request:", data?.message);
        alert(data?.message || "Invalid request");
        break;
      case 401:
        console.warn("Unauthorized");
        handleLogout();
        break;
      case 403:
        console.warn("Forbidden");
        alert("You don’t have permission to perform this action.");
        break;
      case 404:
        console.warn("Not Found");
        alert("Requested resource not found.");
        break;

      case 422:
        console.warn("Validation Error:", data?.errors);
        alert(data?.message || "Validation failed");
        break;
      case 500:
        console.error("Server Error:", data);
        alert("Something went wrong on the server. Try again later.");
        break;
      case 503:
        handleMaintenanceRedirect();
        break;
      default:
        console.error("Unhandled Error:", status, data);
        alert(data?.message || "Unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

export default API;