import axios from "axios";

export const GetFileObjectApi = async (url) => {
    try {
        if (!(url.includes("https"))) {
            url = url.replace("http://", "https://");
        }
        const response = await axios.get(url, { responseType: 'blob' });
        const blob = response.data;
        const file = new File([blob], "images", { type: "image/jpg" });
        // const file = new File([blob], "image", { type: 'multipart/form-data' });
        console.log("file get object", file);
        return file;
    } catch (error) {
        console.log("Error Occurred In GetFileObject => ", error);
        return null;
    }
}

export const GetFilePDF = async (url) => {
    try {
        if (!(url.includes("https"))) {
            url = url.replace("http://", "https://");
        }
        const response = await axios.get(url, { responseType: 'blob' });
        const blob = response.data;
        const fileName = url.split('/').pop(); // ดึงชื่อไฟล์จาก URL
        const file = new File([blob], fileName || "document.pdf", { type: 'application/pdf' });
        return file;
    } catch (error) {
        console.log("Error Occurred In getFilePDF => ", error);
        return null;
    }
}