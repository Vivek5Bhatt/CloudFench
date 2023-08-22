import httpInstance from "../axios";
import { ENDPOINT } from "../EndPoint";

export const deploymentsDefault = async (stackConnector) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.get(
        stackConnector
          ? ENDPOINT.DEPLOYMENTSSTACKCONNECTOR
          : ENDPOINT.DEPLOYMENTSDEFAULT
      );
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const trafficActivityLogs = async (requestdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.post(
        ENDPOINT.TRAFFICACTIVITYLOGS,
        requestdata
      );
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getColumnVisibility = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.get(ENDPOINT.COLUMNVISIBILITY);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const updateColumnVisibility = async (requestdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.post(
        ENDPOINT.COLUMNVISIBILITY,
        requestdata
      );
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const stackConnectivity = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await httpInstance.get(ENDPOINT.STACKCONNECTIVITY);
      return resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};
