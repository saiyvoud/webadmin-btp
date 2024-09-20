import axios from 'axios';
import CryptoJS from 'crypto-js'; // Import the encryption library
import ApiPath from './apiPaths';
import { SECREAT_KEY } from '../constants';

// Define the encryption function
const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data, SECREAT_KEY).toString();
};

export const LoginApi = async (username, password) => {
    const data = { username, password };
    const config = { headers: { "Content-Type": "application/json" } };

    try {
        const response = await axios.post(ApiPath.login, data, config);
        //console.log("Full response:", response);
        // //console.log("response.data.status:", response.data.status);
        // //console.log("response.data:", response.data);

        if (response.data.status === true) {
            // Store encrypted data in localStorage
            localStorage.setItem("profile", response.data.data.profile)
            localStorage.setItem("firstName", response.data.data.firstName)
            localStorage.setItem("lastName", response.data.data.lastName)
            localStorage.setItem("profile", response.data.data.profile)
            localStorage.setItem("token", response.data.data.token.token);
            localStorage.setItem("refreshToken", response.data.data.token.refreshToken);
            localStorage.setItem("UID", response.data.data.id);
            localStorage.setItem("role", encryptData(response.data.data.role));
            localStorage.setItem("expireToken", response.data.data.token.expiredToken);
            return true;
        } else {
            // //console.log("Login failed: status is false");
            return false;
        }
    } catch (error) {
        console.error('Error during login:', error);
        return false;
    }
};


export const register = async (data) => {
    const token = localStorage.getItem("token");
    const headerConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
    };

    //console.log(data);

    const formData = new FormData();
    formData.append("username", data?.username || "");
    formData.append("email", data?.email || "");
    formData.append("password", data?.password || "");
    formData.append("image", data?.file || "", "image");
    formData.append("firstName", data?.firstName || "");
    formData.append("lastName", data?.lastName || "");
    formData.append("phoneNumber", data?.phoneNumber || "");


    try {
        const response = await axios.post(ApiPath.register, formData, headerConfig);
        //console.log(response);
        return response;
    } catch (error) {
        console.error("Error in registerApi =>", error.response?.data || error.message);
        return false;
    }
};
