import httpInstance from "../axios";
import { ENDPOINT } from "../EndPoint";

export const signUpUser = async (requestdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.post(ENDPOINT.SIGNUP, requestdata);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const loginUser = async (requestdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.post(ENDPOINT.LOGIN, requestdata);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const forgotPassword = async (requestdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.post(ENDPOINT.FORGOTPASSWORD, requestdata);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const confirmPassword = async (requestdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.post(
        ENDPOINT.CONFIRMPASSWORD,
        requestdata
      );
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const userMe = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.get(ENDPOINT.USERME);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};
