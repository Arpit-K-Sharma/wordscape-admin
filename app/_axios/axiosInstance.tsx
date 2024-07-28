import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const baseURL = "https://erp-v2-7a15.onrender.com";

const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const adminLogin = async (email, password, role) => {
  try {
    const response = await axiosInstance.post("/home/login", {
      email,
      password,
      role,
    });
    if (response.data && response.data.token) {
      const token = response.data.token;
      Cookies.set("accessToken", token, { expires: 7 });

      const decoded = jwtDecode(token);
      if (decoded.id && decoded.roles && decoded.roles.includes("ROLE_ADMIN")) {
        localStorage.setItem("id", decoded.id);
        toast.success("Admin logged in successfully");
        return true;
      } else {
        console.error("Error: User is not an admin");
        toast.error("Access denied. Admin privileges required.");
        return false;
      }
    } else {
      console.error("Error: No token found in the response");
      return false;
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    toast.error(errorMessage);
    console.error("Error:", error);
    return false;
  }
};

export const getRoleFromToken = () => {
  const token = Cookies.get("accessToken");
  if (token) {
    const decoded = jwtDecode(token);
    return decoded.roles[0];
  } else {
    Cookies.remove("accessToken");
    return null;
  }
};

export const isAdmin = () => {
  return getRoleFromToken() === "ROLE_ADMIN";
};

export default axiosInstance;
