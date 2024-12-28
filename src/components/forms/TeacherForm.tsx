"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useEffect, useState } from "react";
import ImgMutilUploadComp from "@/utils/ImgMutilUpload";
import { SelectFaculty } from "@/common";
import { EV_spTeacher_Save } from "@/app/action/teacher";
import { CallUploadImage } from "@/utils/CallUploadImage";
import { FormatDateJsonPro } from "@/utils/FormatDateJson";
import { Alerterror, Alertsuccess, Alertwarning } from "@/utils/Notifications";

const schema = z.object({
  UserId: z.number(),
  UserName: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  Email: z.string().email({ message: "Invalid email address!" }),
  FullName: z.string().min(1, { message: "First name is required!" }),
  PhoneNumber: z.string().min(1, { message: "Phone is required!" }),
  Address: z.string().min(1, { message: "Address is required!" }),
  BirthDay: z.string({ message: "BirthDay is required!" }),
  Specialty: z.any(),
  Avatar: z.any(),
});

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({
  type,
  data,
  setOpen,
  onActionComplete,
}: {
  type: "create" | "update";
  data?: any;
  setOpen? : any,
  onActionComplete: any,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      UserId: data.UserId,
      UserName: data.UserName,
      FullName: data.FullName,
      PhoneNumber: data.PhoneNumber,
      Address: data.Address,
      BirthDay: data.BirthDay,
      Specialty: data.Specialty,
      Avatar: data.Avatar,
      Email: data.Email,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageData, setImageData] = useState(data?.Avatar); // Dữ liệu ảnh dạng string từ server hoặc xử lý khác
  const [flag, setFlag] = useState(0); // flag để reset hoặc xử lý khác
  const [isReset, setIsReset] = useState(0); // kiểm soát việc reset form upload
  const [isMutil, setIsMutil] = useState(true); // cho phép upload nhiều ảnh

  // Hàm xử lý khi ảnh được upload lên từ máy tính
  const handleImageUpload = (images) => {
    // images là danh sách file hình ảnh từ input
    setUploadedImages(images);
  };

  useEffect(() => {
    if (data) {
      setValue("UserId", data.UserId);
      setValue("UserName", data.UserName);
      setValue("FullName", data.FullName);
      setValue("PhoneNumber", data.PhoneNumber);
      setValue("Address", data.Address);
      setValue("BirthDay", FormatDateJsonPro(data.BirthDay,16));
      setValue("Specialty", data.Specialty);
      setValue("Avatar", data.Avatar);
      setValue("Email", data.Email);
    }
  }, [data, setValue]);

  const onSubmit = handleSubmit(async (dataform) => {
    debugger;
    setIsLoading(true);

    try {
      let _newListImage = "";
      if (uploadedImages.length > 0 && Array.isArray(uploadedImages)) {
        let listimage = "";
        if (
          uploadedImages !== "" &&
          uploadedImages.length > 0 &&
          Array.isArray(uploadedImages)
        ) {
          listimage = await CallUploadImage(uploadedImages);
        }
        _newListImage = listimage[0]?.url;
      } else if (
        typeof uploadedImages === "string" ||
        uploadedImages.length === 0
      ) {
        _newListImage = data?.Avatar;
      } else if (!_newListImage) {
        Alerterror("File error");
        setIsLoading(false);

        return;
      }
      const pr = {
        UserId: dataform?.UserId,
        UserName: dataform?.UserName,
        FullName: dataform?.FullName,
        PhoneNumber: dataform?.PhoneNumber,
        Address: dataform?.Address,
        BirthDay: dataform?.BirthDay,
        Specialty: dataform?.Specialty,
        Email: dataform?.Email,
        Avatar: _newListImage,
      };
      const result = await EV_spTeacher_Save(pr);
      if (result?.Status == "OK") {
        setValue("UserId", 0);
        setValue("UserName", "");
        setValue("FullName", "");
        setValue("PhoneNumber", "");
        setValue("Address", "");
        setValue("BirthDay", new Date());
        setValue("Specialty", 0);
        setValue("Email", "");
        setValue("Avatar", "");
        setImageData("");
        setUploadedImages([]);
        setIsReset(Math.random());
        Alertsuccess(result?.ReturnMess);
        setOpen(false);
        onActionComplete();
        setIsLoading(false);
      } else {
        Alerterror(result?.ReturnMess);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {" "}
        {type === "create" ? "Thêm giảng viên" : "Sửa thông tin"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 flex-wrap gap-4">
        <InputField
          label="Email"
          name="Email"
          register={register}
          error={errors?.Email}
        />
        <InputField
          label="Họ và tên"
          name="FullName"
          register={register}
          error={errors.FullName}
        />
        <InputField
          label="Số điện thoại"
          name="PhoneNumber"
          register={register}
          error={errors.PhoneNumber}
        />
        <InputField
          label="Địa chỉ"
          name="Address"
          defaultValue={data?.Address}
          register={register}
          error={errors.Address}
        />
        <InputField
          label="BirthDay"
          type="date"
          name="BirthDay"
          register={register}
          error={errors?.BirthDay}
        />
        <div>
          <Controller
            name="Specialty"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectFaculty
                label="Khoa-viện"
                onSelected={(selected) => onChange(selected.value)}
                FacultyId={data.Specialty}
                isRequired={true}
              />
            )}
          />
          {errors.Specialty && (
            <span className="text-red-500">
              {errors.Specialty.message as string}
            </span>
          )}
        </div>

        <div>
          <ImgMutilUploadComp
            data={imageData}
            label="Chọn ảnh đại diện"
            onData={setImageData} // Hàm xử lý khi xóa ảnh
            onImageUpload={handleImageUpload} // Hàm xử lý khi chọn ảnh
            flag={flag}
            isReset={isReset}
            isMutil={isMutil}
            readOnly={false} // Cho phép người dùng upload ảnh
          />
        </div>
      </div>

      <button
        className={`bg-sky-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 ${
          isLoading ? "cursor-not-allowed opacity-75" : ""
        }`}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        ) : type === "create" ? (
          "Tạo"
        ) : (
          "Sửa"
        )}
      </button>
    </form>
  );
};

export default TeacherForm;
