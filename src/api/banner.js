import axios from "axios";
import ApiPath from "./apiPaths";
import { getHeaderConfig } from "../helpers";

export const getBannerApi = async () => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const response = await axios.get(ApiPath.getBanner, config)
        // console.log(response?.data?.data);
        return response?.data?.data
    } catch (error) {
        console.error("Error get banner", error);
        return false
    }
}
export const getBannerOneApi = async (id) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        console.log("Get id is =", id);
        const response = await axios.get(`${ApiPath.getBannerOne}/${id}`, config)
        // console.log(response?.data?.data);
        return response?.data?.data
    } catch (error) {
        console.error("Error get banner", error);
        return false
    }
}

export const delBannerApi = async (id) => {
    try {
        const response = await axios.delete(`${ApiPath.delBanner}/${id}`, getHeaderConfig())
        return response
    } catch (error) {
        console.error("Error in delBanner response=>", error);
        return false
    }
}
export const upadteSwitchBannerApi = async (id, value) => {
    const data = {
        isPublished: (value) ? "true" : "false"
    }
    // console.log(data);
    try {
        const response = await axios.put(`${ApiPath.updateSwitchBanner}/${id}`, data, getHeaderConfig())
        return response
    } catch (error) {
        console.error("Error switching banner");
        return false
    }
}

export const addBannerApi = async (data) => {
    const token = localStorage.getItem("token")
    const headerConfig = {
        headers: {
            "Content-type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    }

    const formData = new FormData()
    formData.append("image", data?.image || "")
    // formData.append("url_path", data?.file || "")
    formData.append("title", data?.title || "")
    formData.append("detail", data?.detail || "")

    for (let i = 0; i < data?.file?.length; i++) {
        formData.append("url_path", data?.file[i] || "", data?.file[i].name || "defaultName.pdf");
    }

    if (data?.document && Array.isArray(data.document)) {
        formData.append("document", JSON.stringify(data.document));
    }

    if (data?.typescholarship && Array.isArray(data.typescholarship)) {
        formData.append("typescholarship", JSON.stringify(data.typescholarship));
    }
    // Log the FormData for debugging
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    console.log(data);
    try {
        const response = await axios.post(ApiPath.addBanner, formData, headerConfig)
        return response
    } catch (error) {
        console.error("Error Add item banner", error);
        return false

    }
}


export const updateBannerApi = async (id, data) => {
    const token = localStorage.getItem("token")
    const headerConfig = {
        headers: {
            "Content-type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    }

    const formData = new FormData()
    formData.append("title", data?.title || "")
    formData.append("detail", data?.detail || "")

    if (data?.document && Array.isArray(data.document)) {
        formData.append("document", JSON.stringify(data.document));
    }

    if (data?.typescholarship && Array.isArray(data.typescholarship)) {
        formData.append("typescholarship", JSON.stringify(data.typescholarship));
    }

    console.log(data);
    try {
        const response = await axios.put(`${ApiPath.updateBanner}/${id}`, formData, headerConfig)
        return response
    } catch (error) {
        console.error("Error Add item banner", error);
        return false

    }
}
export const updateImageBannerApi = async (id, data) => {
    const token = localStorage.getItem("token")
    const headerConfig = {
        headers: {
            "Content-type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    }

    const formData = new FormData()
    formData.append("image", data?.image || "")
    formData.append("oldImage", data?.oldImage || "")
    // console.log(data);
    try {
        const response = await axios.put(`${ApiPath.updateImageBanner}/${id}`, formData, headerConfig)
        return response
    } catch (error) {
        console.error("Error Add item banner", error);
        return false

    }
}

export const updateFileBannerApi = async (id, data) => {
    const token = localStorage.getItem("token")
    const headerConfig = {
        headers: {
            "Content-type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    }

    const formData = new FormData();
    if (data?.file && data.file.length > 0) {
        data.file.forEach((file) => {
            formData.append("file", file, file.name); // Use original file name
            console.log("file.name", file.name);
        });
    }

    // Append old file if needed
    formData.append("oldFile", data?.oldFile);

    try {
        const response = await axios.put(`${ApiPath.updateFileBanner}/${id}`, formData, headerConfig)
        return response
    } catch (error) {
        console.error("Error Add item banner", error);
        return false

    }
}