"use client";
import { EV_spUser_Save } from "@/app/action/user";
import { SelectFaculty } from "@/common";
import InputField from "@/components/InputField";
import { useAuth } from "@/context/AuthContext";
import { Alerterror, Alertsuccess, FormatDateJsonPro } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import ChangePassword from "./ChangePassword";
import { CallUploadImage } from "@/utils/CallUploadImage";

const schema = z.object({
  UserId: z.any(),
  FullName: z.string().min(1, { message: "Vui lòng nhập họ và tên!" }),
  PhoneNumber: z
    .string()
    .min(10, { message: "Số điện thoại phải có ít nhất 10 chữ số" }),
  Email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ" }),
  Address: z.string().min(1, { message: "Vui lòng nhập địa chỉ" }),
  BirthDay: z.string().min(1, { message: "Vui lòng chọn ngày sinh" }),
  Specialty: z.any(),
  Avatar: z.any(),
  Sex: z.number(),
});

type Inputs = z.infer<typeof schema>;

const Profile = () => {
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      UserId: user?.UserId,
      FullName: user?.FullName,
      PhoneNumber: user?.PhoneNumber,
      Address: user?.Address,
      BirthDay: FormatDateJsonPro( user?.BirthDay,16),
      Specialty: user?.Specialty,
      Email: user?.Email,
      Sex: user?.Sex,
      Avatar: user?.Avatar,
    },
  });
  const [imageData, setImageData] = useState(user?.Avatar); // Dữ liệu ảnh dạng string từ server hoặc xử lý khác

  useEffect(() => {
    if (user) {
      setValue("UserId", user.UserId);
      setValue("FullName", user.FullName);
      setValue("PhoneNumber", user.PhoneNumber);
      setValue("BirthDay", user.BirthDay);
      setValue("Address", user.Address);
      setValue("Email", user.Email);
      setValue("Specialty", user.Specialty);
      setValue("Sex", user.Sex);
      setValue("Avatar", user.Avatar);
      setImageData(user?.Avatar);
    }
  }, [user, setValue]);

  const [activeTab, setActiveTab] = useState("info");
  const [uploadedImages, setUploadedImages] = useState([]);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const files1 = Array.from(event.target.files);
    setUploadedImages(files1);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setImageData(base64Image); // Cập nhật ảnh mới
      };
      reader.readAsDataURL(file); // Đọc file dưới dạng base64
    }
  };
  const onSubmit = handleSubmit(async (dataform) => {
    setLoading(true);
    try {
      let _newThumnail = "";
      if (uploadedImages.length > 0 && Array.isArray(uploadedImages)) {
        let listimage = "";
        if (
          uploadedImages !== "" &&
          uploadedImages.length > 0 &&
          Array.isArray(uploadedImages)
        ) {
          listimage = await CallUploadImage(uploadedImages);
        }
        _newThumnail = listimage[0]?.url;
      } else if (
        typeof uploadedImages === "string" ||
        uploadedImages.length === 0
      ) {
        _newThumnail = user?.Avatar;
      } else if (!_newThumnail) {
        Alerterror("File error");
        setLoading(false);
        return;
      }
      const pr = {
        UserId: dataform?.UserId,
        FullName: dataform?.FullName,
        Email: dataform?.Email,
        PhoneNumber: dataform?.PhoneNumber,
        Address: dataform?.Address,
        BirthDay: dataform?.BirthDay,
        Specialty: dataform?.Specialty,
        Sex: dataform?.Sex,
        Avatar: _newThumnail,
      };
      const result = await EV_spUser_Save(pr);
      console.log(result);
      if (result?.Status == "OK") {
        localStorage.setItem("userEvent", JSON.stringify(result?.user));

        Alertsuccess(result?.ReturnMess);
        setLoading(false);
      } else {
        Alerterror(result?.ReturnMess);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  });

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div
      className="flex justify-center items-center pt-4 h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-login.jfif')" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">Cá nhân</h2>
        <div className="flex border-b mb-6">
          <button
            className={`flex-1 text-center py-2 ${
              activeTab === "info"
                ? "border-b-2 border-indigo-500 text-indigo-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Thông tin
          </button>
          <button
            className={`flex-1 text-center py-2 ${
              activeTab === "change-password"
                ? "border-b-2 border-indigo-500 text-indigo-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("change-password")}
          >
            Đổi mật khẩu
          </button>
        </div>

        {activeTab === "info" && (
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <Controller
                name="Avatar"
                control={control}
                render={({ field }) => (
                  <>
                    <Image
                      src={imageData || "/upload.png"}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full border-2 border-indigo-500 shadow-md"
                      width={96}
                      height={96}
                    />
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        handleImageUpload(e);
                        field.onChange(e.target.files[0]); // Liên kết giá trị với react-hook-form
                      }}
                    />
                  </>
                )}
              />

              <button
                type="button"
                onClick={triggerFileInput}
                className="mt-3 text-indigo-600 hover:underline text-sm"
              >
                Đổi hình đại diện
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="FullName"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Họ và tên"
                    name="FullName"
                    defaultValue={field.value}
                    register={register}
                    error={errors?.FullName}
                  />
                )}
              />

              <Controller
                name="Email"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Email"
                    type="email"
                    name="Email"
                    defaultValue={field.value}
                    register={register}
                    error={errors?.Email}
                  />
                )}
              />

              <Controller
                name="PhoneNumber"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Số điện thoại"
                    name="PhoneNumber"
                    defaultValue={field.value}
                    register={register}
                    error={errors?.PhoneNumber}
                  />
                )}
              />

              <Controller
                name="Specialty"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectFaculty
                    label="Khoa-viện"
                    onSelected={(selected) => {
                      onChange(selected.value);
                    }}
                    FacultyId={Number(value)}
                    isRequired={true}
                  />
                )}
              />
              {/* <SelectFaculty label="Khoa/Viện" /> */}

              <Controller
                name="BirthDay"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Ngày sinh"
                    type="date"
                    name="BirthDay"
                    defaultValue={'2024-01-01'}
                    register={register}
                    error={errors?.BirthDay}
                  />
                )}
              />

              <div>
                <label className="text-xs text-gray-500">Giới tính</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center">
                    <Controller
                      name="Sex"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            id="male"
                            type="radio"
                            value={1}
                            checked={field.value === 1}
                            onChange={() => field.onChange(1)} // Cập nhật giá trị `1`
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <label
                            htmlFor="male"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Nam
                          </label>
                        </>
                      )}
                    />
                  </div>

                  <div className="flex items-center">
                    <Controller
                      name="Sex"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            id="female"
                            type="radio"
                            value={2}
                            checked={field.value === 2}
                            onChange={() => field.onChange(2)} // Cập nhật giá trị `2`
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <label
                            htmlFor="female"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Nữ
                          </label>
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              {/* <button
                type="submit"
                className="bg-sky-600 text-white font-bold py-2 px-4 rounded-md shadow-md"
              >
                Lưu
              </button> */}
              <button
                className={`bg-sky-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 ${
                  loading ? "cursor-not-allowed opacity-75" : ""
                }`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
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
                ) : (
                  "Lưu"
                )}
              </button>
            </div>
          </form>
        )}

        {activeTab === "change-password" && <ChangePassword />}
      </div>
    </div>
  );
};

export default Profile;
