// Importing dependencies
import axios from "axios";
import ApiPath from "./apiPaths";
import { getHeaderConfig } from "../helpers";

// API Calls
export const getNewsApi = async () => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const response = await axios.get(ApiPath.getNews, config);
        return response?.data?.data;
    } catch (error) {
        //console.log("Error getNews =>", error);
        return false;
    }
};
export const getOneNewsApi = async (id) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const response = await axios.get(`${ApiPath.getOneNews}/${id}`, config);
        return response?.data?.data;
    } catch (error) {
        //console.log("Error getNews =>", error);
        return false;
    }
};

export const addNewsApi = async (data) => {
    const token = localStorage.getItem("token");
    const headerConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
    };

    const formData = new FormData();
    formData.append("title", data?.title || "");
    formData.append("detail", data?.detail || "");
    for (let i = 0; i < data?.image?.length; i++) {
        formData.append("image", data?.image[i] || "", data?.image[i]?.name || "image" + i);
    }
    formData.append("cover_image", data?.cover_image || "");

    try {
        const response = await axios.post(ApiPath.addNews, formData, headerConfig);
        return response;
    } catch (error) {
        //console.log("error occurred in AddProductApi ==> ", error);
        return false;
    }
};

export const delNewsApi = async (id) => {
    try {
        const response = await axios.delete(`${ApiPath.delNews}/${id}`, getHeaderConfig());
        return response;
    } catch (error) {
        console.error("Error in delNewsApi =>", error);
        return false;
    }
};

export const updateNewsApi = async (id, data) => {
    const token = localStorage.getItem("token");
    const headerConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
    };

    const formData = new FormData();
    formData.append("title", data?.title || "");
    formData.append("detail", data?.detail || "");


    try {
        const response = await axios.put(`${ApiPath.updateNews}/${id}`, formData, headerConfig);
        return response;
    } catch (error) {
        console.error("Error updating news:", error);
        return false;
    }
};

export const updateNewsImageApi = async (id, data) => {
    const token = localStorage.getItem("token");
    const headerConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
    };
    const formData = new FormData();
    for (let i = 0; i < data?.image?.length; i++) {
        formData.append("image", data?.image[i] || "", data?.image[i]?.name || "image" + i);
    }
    formData.append("oldImage", data?.oldImage || "");
    try {
        const response = await axios.put(`${ApiPath.updateNewsImage}/${id}`, formData, headerConfig);
        return response;
    } catch (error) {
        console.error("Error updating news:", error);
        return false;
    }
}
export const updateNewsFileApi = async (id, data) => {
    const token = localStorage.getItem("token");
    const headerConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
    };
    const formData = new FormData();
    // formData.append("image", data?.image || "");
    // formData.append("oldImage", data?.oldImage || "");
    formData.append("file", data?.file || "");
    formData.append("oldFile", data?.oldFile || "");

    try {
        const response = await axios.put(`${ApiPath.updateNewsFile}/${id}`, formData, headerConfig);
        return response;
    } catch (error) {
        console.error("Error updating news:", error);
        return false;
    }
}
export const updateNewsCoverApi = async (id, data) => {
    const token = localStorage.getItem("token");
    const headerConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
    };
    const formData = new FormData();
    // formData.append("image", data?.image || "");
    // formData.append("oldImage", data?.oldImage || "");
    formData.append("cover_image", data?.cover_image || "");
    formData.append("oldCover_image", data?.oldCover_image || "");

    try {
        const response = await axios.put(`${ApiPath.updateNewsCover}/${id}`, formData, headerConfig);
        return response;
    } catch (error) {
        console.error("Error updating news:", error);
        return false;
    }
}