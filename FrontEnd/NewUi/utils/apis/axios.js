import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next";
import { isTokenExpired } from '../../utils/commonFunctions';

const httpInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

httpInstance.interceptors.request.use(
  async (config) => {
    let token = getCookie("token");
    if (token && isTokenExpired(token)) {
      deleteCookie('token')
      deleteCookie("idToken");
      deleteCookie("userId");
      deleteCookie("userName");
      window.location.replace('/')
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default httpInstance;
