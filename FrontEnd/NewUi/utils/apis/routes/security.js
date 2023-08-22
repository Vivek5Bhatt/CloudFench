// import httpInstance from "../axios";
// import { ENDPOINT } from "../EndPoint";
import { getCookie } from "cookies-next";
import axios from "axios";

const idToken = getCookie("idToken");

export const securityProfile = async (requestdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const res = await httpInstance.post(ENDPOINT.SECURITYPROFILE, requestdata);
      const res = await axios.post(
        process.env.NEXT_PUBLIC_SECURITY_PROFILE_LAMBDA_URL,
        requestdata,
        {
          headers: {
            Authorization: idToken,
          },
        }
      );
      return resolve(res);
    } catch (error) {
      return reject(error)
    }
  })
};
