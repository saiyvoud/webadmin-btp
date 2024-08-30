import axios from "axios";

export const GetFileObjectApi = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'blob' });
        const blob = response.data;
        const file = new File([blob], "image", { type: blob.type });
        return file;
    } catch (error) {
        console.log("Error Occurred In GetFileObject => ", error);
        return null;
    }
}
export const getFilePDF = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'blob' });
        const blob = response.data;
        const file = new File([blob], "document.pdf", { type: 'application/pdf' });
        return file;
    } catch (error) {
        console.log("Error Occurred In getFilePDF => ", error);
        return null;
    }
}