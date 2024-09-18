import axios from "axios";
import ApiPath from "./apiPaths";
import { getHeaderConfig } from "../helpers";

export const addServiceApi = async (name, userId) => {
    try {
        if (!name || !userId) {
            throw new Error('Name and userId are required');
        }

        const data = { name, userId };
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : undefined,
            }
        };

        const response = await axios.post(ApiPath.addCategory, data, config);
        //console.log("Full response:", response);

        if (response.data.status === true) {
            return true;
        } else {
            //console.log(`Operation failed: ${response.data.message}`);
            return false;
        }
    } catch (error) {
        console.error("Error during request:", error.response ? error.response.data : error.message);
        return false;
    }
};


export const updateServiceApi = async (id, name) => {
    try {
        // const token = localStorage.getItem("token")
        const data = {
            name: name
        }

        const response = await axios.put(`${ApiPath.updateCategory}/${id}`, data, getHeaderConfig())
        //console.log(response);
        return response
    } catch (error) {
        //console.log("error occured in UpdateProductApi ==> ", error)
        return false
    }

}

export const getServiceApi = async () => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const response = await axios.get(ApiPath.getCategory, config)
        return response?.data?.data
    } catch (error) {
        console.error("Error req => \n", error);
        return false
    }
}



// delete
export const deleteCategoryApi = async (id) => {
    try {
        const response = await axios.delete(`${ApiPath.deleteCategory}/${id}`, getHeaderConfig())
        return response
    } catch (error) {
        return false
    }
}