"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import axios from "axios";
import Image from "next/image";
import { Alerterror, Alertwarning } from "./Notifications";
import envConfig from "@/config";

interface ImgMutilUploadProps {
  data?: string;
  onData?: (data: string) => void;
  onImageUpload?: (images: File[]) => void;
  flag?: number;
  isReset?: number;
  isMutil?: boolean;
  readOnly?: boolean;
  label?: string;
  className?:string;
}

const ImgMutilUploadComp: React.FC<ImgMutilUploadProps> = ({
  data = "",
  onData = () => {},
  onImageUpload = () => {},
  flag = 0,
  isReset = 0,
  isMutil = false,
  readOnly = false,
  label = "Tải hình ảnh",
  className=""
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [ImageUpload, setImageUpload] = useState<File[]>([]); // Chứa các ảnh đã chọn
  const [i, setI] = useState<string[]>([]); // Chứa các ảnh hiện tại đã lưu

  // Khi có thay đổi dữ liệu (ảnh đã có trước đó), cập nhật state
  useEffect(() => {
    if (data !== undefined) {
      const arr = data?.split(",").filter((p) => p !== "" && p !== "undefined");
      setI(arr);
    } else {
      setI([]);
    }
  }, [data]);

  // Khi có reset, xóa dữ liệu
  useEffect(() => {
    if (isReset !== 0) {
      inputRef.current!.value = "";
      setImageUpload([]);
    }
  }, [isReset]);

  // Xóa các ảnh đã upload khi flag thay đổi
  useEffect(() => {
    if (flag === 1) {
      setImageUpload([]);
    }
  }, [flag]);

  // Hàm xử lý khi người dùng chọn file
  const handleChangeFileAndImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files); // Lấy danh sách file từ input

      let check = files.every((file) => {
        const exName = file.name.slice(
          (Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1
        );
        return ["jpg", "jpeg", "png", "gif"].includes(exName);
      });

      if (check) {
        if (!isMutil) {
          setI([]); // Nếu chỉ chọn 1 file thì clear các file trước
          setImageUpload(files);
        } else {
          setImageUpload((prev) => [...prev, ...files]); // Nếu chọn nhiều file
        }
        onImageUpload(files); // Gọi callback để lưu file
      } else {
        Alertwarning(
          'File không đúng định dạng! Vui lòng chọn lại file có định dạng "jpg", "jpeg", "png", "gif"'
        );
      }
    }
  };

  // Hàm gọi API để upload ảnh lên Cloudinary khi cần
  const handleUploadToCloudinary = async () => {
    try {
      for (let file of ImageUpload) {
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

        // Sau khi upload thành công, cập nhật lại danh sách ảnh
        const imageUrl = response.data.Url;
        setI((prev) => [...prev, imageUrl]);
        onData(i.join(",")); // Trả về URL các ảnh đã upload
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      Alerterror("Upload ảnh thất bại!");
    }
  };

  // Hàm xóa ảnh
  const onFileDelete = (filename: string) => {
    if (window.confirm("Bạn có chắc muốn xóa ảnh này?")) {
      const updatedFiles = i.filter((file) => file !== filename);
      setI(updatedFiles);
      onData(updatedFiles.join(","));
    }
  };

  return (
    <>
      <div className={`form-group ${className}`}>
        {!readOnly && (
          <>
            <label className="image-collapse-label2 flex items-center gap-2 w-full cursor-pointer">
              <input
                type="file"
                className="image-collapse-file cursor-pointer hidden"
                onChange={handleChangeFileAndImage}
                accept="image/*"
                multiple={isMutil}
                ref={inputRef}
                readOnly={readOnly}
              />
              <Image src="/upload.png" alt="" width={28} height={28} />
              <p className="text-gray-600 text-sm">{label}</p>
            </label>
          </>
        )}

        {/* Hiển thị các ảnh đã chọn mà chưa upload */}
        <div className="grid grid-cols-4 gap-2">
          {ImageUpload.map((file, ix) => (
            <div className="shadow-lg relative rounded-sm p-2" key={ix}>
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="w-[200px] max-h-[150px] object-contain"
              />
              <i
                className="fa fa-times p-2 text-danger cursor-pointer absolute top-0 right-0 btn-curso"
                onClick={() =>
                  setImageUpload((prev) =>
                    prev.filter((_, index) => index !== ix)
                  )
                }
              ></i>
            </div>
          ))}
        </div>

        {/* Hiển thị các ảnh đã upload */}
        <div className="grid grid-cols-4 gap-2">
          {i.length > 0 &&
            i.map((item, ix) => (
              <div className="shadow-lg relative rounded-sm" key={ix}>
                <img
                  src={item}
                  alt=""
                  className="w-[200px] max-h-[150px] object-contain"
                />
                {!readOnly && (
                  <>
                    <div
                      className="p-2 text-danger cursor-pointer absolute top-0 right-0 btn-cursor"
                      onClick={() => onFileDelete(item)}
                    >
                      <Image
                        src="/close.png"
                        alt="Close"
                        width={14}
                        height={14}
                      />
                    </div>
                  
                  </>
                )}
              </div>
            ))}
        </div>

        {/* Nút upload các ảnh đã chọn */}
      </div>
    </>
  );
};

export default ImgMutilUploadComp;
