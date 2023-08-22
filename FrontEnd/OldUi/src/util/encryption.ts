import CryptoJS from "crypto-js";
export function encryptPayload(data: any) {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.REACT_APP_SECRET_KEY
  ).toString();
  return ciphertext;
}
