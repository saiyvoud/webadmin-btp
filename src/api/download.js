import axios from "axios"
import ApiPath from "./apiPaths"

export const getDownloadTotalApi = async (date) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const response = await axios.get(`${ApiPath.getTotalDownload}${date}`, config)
        return response?.data?.data
    } catch (error) {
        console.error(error);
        return false
    }
}