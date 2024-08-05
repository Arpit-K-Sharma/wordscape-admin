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
const baseURL = "http://127.0.0.1:8000";

const axiosInstance = axios.create({
  baseURL: baseURL,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers["access_token"] = token; // Store token as access_token in the header
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
// Admin login function
export const adminLogin = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.post("/admin/login", {
      email, // Sending email as part of the request body
      password, // Sending password as part of the request body
    });

    if (response.data.access_token) {
      const token = response.data.access_token;
      Cookies.set("accessToken", token, { expires: 7 }); // Store token in cookies

      // Set the access_token header for future requests
      axiosInstance.defaults.headers.common["access_token"] = token;

      toast.success("Admin logged in successfully");
      return true;
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
