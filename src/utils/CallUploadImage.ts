import envConfig from "@/config";
import axios from "axios";

export const CallUploadImage = async (files: File[]): Promise<any[]> => {
    const uploadedImages: any[] = []; // Tạo mảng để lưu các kết quả phản hồi của các file ảnh

    try {
        for (let file of files) {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                `${envConfig.NEXT_PUBLIC_API_UPLOAD}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // Sau khi upload thành công, đẩy kết quả vào mảng uploadedImages
            uploadedImages.push(response.data); // Chỉ lấy response.data nếu bạn chỉ cần dữ liệu ảnh từ server
        }
        return uploadedImages; // Trả về danh sách các kết quả sau khi upload thành công
    } catch (error) {
        console.error("Lỗi khi upload ảnh:", error);
        alert("Upload ảnh thất bại!");
        return []; // Trả về mảng rỗng nếu có lỗi xảy ra
    }
};
