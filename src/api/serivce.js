import axios from "axios";
import ApiPath from "./apiPaths";
import { getHeaderConfig } from "../helpers";

export const getService = async () => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const response = await axios.get(ApiPath.getService, config);

        //console.log("Get service is success => \n", response?.data?.data);

        return response?.data?.data;
    } catch (error) {
        if (error.response) {
            console.error("API Error:", error.response.data);
        } else if (error.request) {
            console.error("Network Error: No response received", error.request);
        } else {
            console.error("Error in setup:", error.message);
        }
        return [];
    }
};
export const getOneService = async (id) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const response = await axios.get(`${ApiPath.getOneService}/${id}`, config);

        //console.log("Get one service is success => \n", response?.data?.data);

        return response?.data?.data;
    } catch (error) {
        if (error.response) {
            console.error("API Error:", error.response.data);
        } else if (error.request) {
            console.error("Network Error: No response received", error.request);
        } else {
            console.error("Error in setup:", error.message);
        }
        return [];
    }
};


export const deleteServiceApi = async (id) => {
    try {
        const response = axios.delete(`${ApiPath.deleteSetvice}/${id}`, getHeaderConfig())
        // console.log(response);
        return response
    } catch (error) {
        console.error("Error not delete \n", error);
        return false
    }
}
export const addServiceApi = async (data) => {
    const token = localStorage.getItem("token");
    const headerConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
    };

    const formData = new FormData();
    formData.append("description", data?.description || "");
    formData.append("title", data?.title || "");
    formData.append("category_id", data?.category_id || "");
    formData.append("image", data?.image || "");


    for (let i = 0; i < data?.file?.length; i++) {
        formData.append("file", data?.file[i] || "", data?.file[i].name || "defaultName.pdf");
    }

    if (data?.document && Array.isArray(data.document)) {
        formData.append("document", JSON.stringify(data.document));
    }

    if (data?.typescholarship && Array.isArray(data.typescholarship)) {
        formData.append("typescholarship", JSON.stringify(data.typescholarship));
    }

    // Log ข้อมูลใน formData สำหรับตรวจสอบ
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    try {
        const response = await axios.post(ApiPath.addService, formData, headerConfig);
        return response;
    } catch (error) {
        console.log("error occurred in AddServiceApi ==> ", error);
        return false;
    }
};



export const updateServiceApi = async (id, data) => {
    // console.log(id);
    const token = localStorage.getItem("token");
    const headerConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    };
    const formData = new FormData();
    formData.append("description", data?.description || "");
    formData.append("title", data?.title || "");
    // formData.append("file", data?.file || "");
    formData.append("category_id", data?.category_id || "");
    // formData.append("image", data?.image || "");
    if (data?.document && Array.isArray(data.document)) {
        formData.append("document", JSON.stringify(data.document));
    }

    if (data?.typescholarship && Array.isArray(data.typescholarship)) {
        formData.append("typescholarship", JSON.stringify(data.typescholarship));
    }

    console.log(data);
    try {
        const response = await axios.put(`${ApiPath.updateService}/${id}`, formData, headerConfig)
        // console.log(response);
        return response
    } catch (error) {
        console.error("Error update service api =>", error);
    }
}
export const updateServiceImage = async (id, data) => {
    const token = localStorage.getItem("token");
    const headerConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    };
    console.log("data image api ", data);
    const formData = new FormData()
    formData.append("image", data?.image || "")
    formData.append("oldImage", data?.oldImage || "")

    try {
        const response = await axios.put(`${ApiPath.updateServiceImage}/${id}`, formData, headerConfig);
        console.log("res of UpdateServiceImageApi =>> ");
        console.log(response);
        return response;
    } catch (error) {
        console.log("error occured in UpdateProductApi ==> ", error);
        return false;
    }
}

export const updateServiceFileApi = async (id, data) => {
    console.log("data updateServiceFileApi =>>", data);
    const token = localStorage.getItem("token");
    const headerConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    };

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
        const response = await axios.put(`${ApiPath.updateServiceFile}/${id}`, formData, headerConfig);
        console.log("res of UpdateServiceImageApi =>> ", response);
        return response;
    } catch (error) {
        console.log("error occured in UpdateServiceFileApi ==> ", error);
        return false;
    }
}
