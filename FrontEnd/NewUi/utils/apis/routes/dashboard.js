import axios from "axios";
import { getCookie } from "cookies-next";
import httpInstance from "../axios";
import { ENDPOINT } from "../EndPoint";

const idToken = getCookie("idToken"); //change this to idToken or token
export const getDestinations = async (apiData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const res = await httpInstance.post(ENDPOINT.GETDESTINATION, apiData);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SECURITY_PROFILE_LAMBDA_URL}/${ENDPOINT.GETDESTINATION}`,
        // "http://192.168.1.88:4000/data-log",
        apiData,
        {
          headers: {
            Authorization: idToken, //`Bearer ${idToken}`, //idToken,
          },
        }
      );
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getDashboardExposure = async (apiData) => {
  let apiD = {
    accounts: apiData,
  };
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SECURITY_PROFILE_LAMBDA_URL}/${ENDPOINT.DASHBOARDPOSTURE}`,
        apiD,
        {
          headers: {
            Authorization: idToken,
          },
        }
      );
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};
