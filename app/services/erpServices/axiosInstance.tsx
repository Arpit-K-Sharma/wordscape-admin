import axios from "axios";
// import Cookies from "js-cookie";

export const baseURL = "http://localhost:8081";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081",
});

axiosInstance.interceptors.request.use(
  (config) => {
    // const token = Cookies.get("accessToken");
    const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sImlkIjoiNjY4ODAzOWQ3MjlmMTIwYmMyNzFlOGYyIiwiZXhwIjoxNzIzMjg0NDMxLCJpYXQiOjE3MjI0MjA0MzF9.DYlsGsxXjOGyl7KA2PQHZjhBkPAmGwa1EH8JAez64IC8Hbh1QiFh-DYgc5N0Rf663iK0TJs_ZelczkzgH_122Q";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log(token);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fixing the response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Corrected syntax error here
    if (error.response && error.response.status === 401) {
      window.location.href = "/login"; // Redirect to login on 401 error
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
