import httpInstance from "../axios";
import { ENDPOINT } from "../EndPoint";
import axios from "axios";

export const cloudConnectorPolicy = async () => {
  //requestdata
  return new Promise(async (resolve, reject) => {
    try {
      // const res = await httpInstance.get(`${ENDPOINT.CLOUDCONNECTORPOLICY}/${requestdata}`);
      const res = await axios.get(process.env.NEXT_PUBLIC_POLICY_JSON);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const cloudConnector = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.get(ENDPOINT.CLOUDCONNECTOR);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const createCloudConnector = async (requestdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.post(ENDPOINT.CLOUDCONNECTOR, requestdata);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const updateCloudConnector = async (requestdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.put(ENDPOINT.CLOUDCONNECTOR, requestdata);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const deleteCloudConnector = async (requestdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.delete(
        `${ENDPOINT.CLOUDCONNECTOR}/${requestdata}`
      );
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const deployStackApi = async (requestdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.post(ENDPOINT.DEPLOYSTACK, requestdata);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getInfraEmailCode = async (requestdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.get(ENDPOINT.EMAILCODE, requestdata);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const deleteDeployedStack = async (requestdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.delete(
        `${ENDPOINT.DELETEdEPLOYEDSTACK}/${requestdata}`
      );
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getStackSources = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.post(ENDPOINT.GETSTACKSOURCES, data);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getStackSubnet = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.post(ENDPOINT.GETSTACKSUBNETS, data);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const addStackConnector = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.post(ENDPOINT.ADDSTACKCONNECT, data);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};
