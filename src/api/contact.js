import axios from "axios"
import ApiPath from "./apiPaths"


export const getContactApi = async () => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const response = await axios.get(ApiPath.getContact, config)
        return response?.data?.data
    } catch (error) {
        console.error("Error get contact api", error)
    }
}

export const deleteContactApi = async (id) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const response = await axios.delete(`${ApiPath.deleteContact}/${id}`, config)
        return response
    } catch (error) {

    }
}