import axios from "axios";
import ApiPath from "./apiPaths";


export const getViewApi = async (date) => {
    // const date = Date()
    // //console.log("date = ", formatDate(date));
    // const data ={
    //     date:Date()
    // }
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const response = await axios.get(`${ApiPath.getView}?date=${date}`)
        return response?.data?.data
    } catch (error) {
        console.error("Error get view", error);
        return false
    }
}