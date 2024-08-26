import axios from "axios";
import ApiPath from "./apiPaths";
import { getHeaderConfig } from "../helpers";


export const getAboutApi = async () => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const response = await axios.get(ApiPath.getAbout, config)
        console.log(response?.data?.data);
        return response?.data?.data
    } catch (error) {
        console.error("Error  fetching about API", error);
        return false
    }
}

export const delAboutApi = async (id) => {
    try {
        const response = await axios.delete(`${ApiPath.delAbout}/${id}`, getHeaderConfig())
        return response
    } catch (error) {
        console.error("Error deleting about API", error);
        return false
    }
}

export const getCoverImageApi = async () => {
    try {
        const response = await axios.get(ApiPath.getCoverImage, getHeaderConfig())
        // console.log(response?.data?.data);
        return response?.data?.data
    } catch (error) {
        console.error("Error cover image API", error);
        return false
    }
}

export const addCoverImageApi = async (data) => {
    const token = localStorage.getItem("token")
    const configHeader = {
        headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${token}`
        }
    }
    const formData = new FormData();
    formData.append("image", data?.image || "");
    try {
        const response = await axios.post(ApiPath.addCoverImage, formData, configHeader)
        return response
    } catch (error) {
        console.error("Error add cover img api", error);
        return false
    }
}
export const updateCoverImageApi = async (id, data) => {
    const token = localStorage.getItem("token");
    const configHeader = {
        headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${token}`,
        },
    };
    const formData = new FormData();
    formData.append("image", data?.image || "");
    formData.append("oldImage", data?.oldImg || "");  // Ensure consistency with naming

    try {
        const response = await axios.put(`${ApiPath.updateCoverImage}/${id}`, formData, configHeader);
        return response;
    } catch (error) {
        console.error("Error in updateCoverImageApi", error);
        return false;
    }
};

export const updateCompanyData = async (id, data) => {
    const token = localStorage.getItem("token")
    const configHeader = {
        headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${token}`
        }
    }

    const formData = new FormData()
    formData.append("title", data?.title || "")
    formData.append("description", data?.description || "")
    formData.append("icon", data?.image || "")

    console.log(data);
    try {
        const response = await axios.put(`${ApiPath.updateCompanyData}/${id}`, formData, configHeader)
        return response
    } catch (error) {
        console.error("Error add cover img api", error);
        return false
    }
}

export const getCompanyDataApi = async () => {
    try {
        const response = await axios.get(ApiPath.getCompanyData, getHeaderConfig())
        console.log(response?.data?.data);
        return response?.data?.data
    } catch (error) {
        console.error("Error cover image API", error);
        return false
    }
}