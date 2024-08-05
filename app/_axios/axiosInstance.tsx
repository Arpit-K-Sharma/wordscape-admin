import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  roles: string[];
}

interface ErrorResponseData {
  message?: string;
}

// const baseURL = "https://erp-api.wordscapepress.com";
const baseURL = "http://localhost:8081";


const axiosInstance = axios.create({
  baseURL: baseURL,
});

// Request interceptor
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

// Response interceptor
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

// Admin login function
export const adminLogin = async (
  email: string,
  password: string,
  role: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.post("/home/login", {
      email,
      password,
      role,
    });
    if (response.data && response.data.token) {
      const token = response.data.token;
      Cookies.set("accessToken", token, { expires: 7 });

      const decoded = jwtDecode<CustomJwtPayload>(token); // Correct usage
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
    const axiosError = error as AxiosError<ErrorResponseData>;
    const errorMessage = axiosError.response?.data?.message || "Login failed";
    toast.error(errorMessage);
    console.error("Error:", error);
    return false;
  }
};

// Function to get role from token
export const getRoleFromToken = () => {
  const token = Cookies.get("accessToken");
  if (token) {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    return decoded.roles[0];
  } else {
    Cookies.remove("accessToken");
    return null;
  }
};

// Function to check if the user is an admin
export const isAdmin = () => {
  return getRoleFromToken() === "ROLE_ADMIN";
};

export default axiosInstance;
