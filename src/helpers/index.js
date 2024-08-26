import CryptoJS from "crypto-js";
import { SECREAT_KEY } from "../constants";

export const getHeaderConfig = () => {
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Content-Type": "application/json",
            'Authorization': token ? `Bearer ${token}` : undefined,
        },
    };
    return config
}

export function decryptData(data) {
    return CryptoJS.AES.decrypt(data, SECREAT_KEY).toString(CryptoJS.enc.Utf8);
}

export function isAllowedRole(allowedRoles) {
    const encryptedRole = localStorage.getItem("role");
    const currentRole = decryptData(encryptedRole);
    // localStorage.setItem("currentRole", currentRole)
    if (!(allowedRoles.includes(currentRole))) {
        return false;
    }
    return true;
}


export const encryptData = (data) => {
    // const secretKey = 'yourSecretKey';
    return CryptoJS.AES.encrypt(data, SECREAT_KEY).toString();
};
