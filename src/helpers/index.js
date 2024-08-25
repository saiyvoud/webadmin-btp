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


export const encryptData = (data) => {
    // const secretKey = 'yourSecretKey';
    return CryptoJS.AES.encrypt(data, SECREAT_KEY).toString();
};
