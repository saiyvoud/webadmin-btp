import axios from "axios";
import ApiPath from "./apiPaths";
import { getHeaderConfig } from "../helpers";
import Swal from "sweetalert2";


export const getUserApi = async () => {
    try {
        const response = await axios.get(ApiPath.getUser, getHeaderConfig())
        console.log(response?.data?.data);
        return response?.data?.data
    } catch (error) {
        console.error("Error req get user", error);
        return false
    }
}
export const getUserOneApi = async (id) => {
    try {
        const response = await axios.get(`${ApiPath.getUserOne}/${id}`, getHeaderConfig())
        console.log(response?.data?.data);
        return response?.data?.data
    } catch (error) {
        console.error("Error req get user", error);
        return false
    }
}

export const delteUserApi = async (id) => {
    try {
        const respone = await axios.delete(`${ApiPath.deleteUser}/${id}`, getHeaderConfig())
        return respone
    } catch (error) {
        console.error("Error can't Delete user \n", error);
        return false
    }
}

export const updateUserApi = async (id, data) => {
    const token = localStorage.getItem("token");
    const headerConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    }
    const formData = new FormData()
    formData.append("email", data?.email || "")
    formData.append("password", data?.password || "")
    formData.append("firstName", data?.firstName || "")
    formData.append("lastName", data?.lastName || "")
    formData.append("phoneNumber", data?.phoneNumber || "")
    formData.append("role", data?.role || "")

    try {
        const response = await axios.put(`${ApiPath.updateUser}/${id}`, formData, headerConfig);
        const userID = localStorage.getItem("UID")
        console.log(userID == id);
        if (userID == id) {
            localStorage.setItem("firstName", data?.firstName)
            localStorage.setItem("lastName", data?.lastName)
        }
        // console.log("res of UpdateProductApi =>> ");
        // console.log(response);
        return response;
    } catch (error) {
        console.log("error occured in UpdateProductApi ==> ", error);
        return false;
    }
};

export const updateUserImage = async (id, data) => {
    const token = localStorage.getItem("token");
    const headerConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    };

    const formData = new FormData();
    formData.append("image", data?.image || "");
    formData.append("oldProfile", data?.oldImage || "");
    console.log(data);

    try {
        const response = await axios.put(`${ApiPath.updateUserImage}/${id}`, formData, headerConfig);
        const userID = localStorage.getItem("UID")
        // console.log(userID == id);
        // if (userID == id) {
        //     localStorage.setItem("image", data?.image)
        // }
        return response;
    } catch (error) {
        console.log("Error occurred in updateUserImage API ==> ", error);
        return false;
    }
};
