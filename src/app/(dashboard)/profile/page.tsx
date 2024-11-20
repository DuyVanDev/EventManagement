"use client";
import {
  EV_spEvent_Login,
  EV_spStudent_Save,
  EV_spUser_Save,
} from "@/app/action/user";
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
      BirthDay: user?.BirthDay,
      Specialty: user?.Specialty,
      Email: user?.Email,
      Sex: user?.Sex,
      Avatar: user?.Avatar,
    },
  });
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
    }
  }, [user, setValue]);

  const [activeTab, setActiveTab] = useState("info");

  const onSubmit = handleSubmit(async (dataform) => {
    debugger;
    console.log(dataform);
    try {
      const pr = {
        UserId: dataform?.UserId,
        FullName: dataform?.FullName,
        Email: dataform?.Email,
        PhoneNumber: dataform?.PhoneNumber,
        Address: dataform?.Address,
        BirthDay: dataform?.BirthDay,
        Specialty: dataform?.Specialty,
        Sex: dataform?.Sex,
        Avatar: dataform?.Avatar,
      };
      const result = await EV_spUser_Save(pr);
      if (result?.Status == "OK") {
        await login(result?.user?.UserName, result?.user?.Password);

        Alertsuccess(result?.ReturnMess);
      } else {
        Alerterror(result?.ReturnMess);
      }
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <div className="flex justify-center items-center ">
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
                    {console.log("a", field)}
                    <Image
                      src={field.value || "/upload.png"}
                      alt="Avatar"
                        className="w-24 h-24 rounded-full border-2 border-indigo-500 shadow-md"
                      width={96}
                      height={96}
                    />
                  </>
                )}
              />

              <button
                type="button"
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
                    label="PhoneNumber"
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
                      console.log(selected);
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
                    label="BirthDay"
                    type="date"
                    name="BirthDay"
                    defaultValue={FormatDateJsonPro(field.value, 16)}
                    register={register}
                    error={errors?.BirthDay}
                  />
                )}
              />

              <div>
                <label className="text-xs text-gray-500">Giới tính</label>
                <div className="mt-2 flex items-center gap-2">
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
                            {...field}
                            checked={field.value == 1}
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
                          {console.log("fsaa", field)}
                          <input
                            id="female"
                            type="radio"
                            value={2}
                            {...field}
                            checked={field.value == 2}
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
              <button
                type="submit"
                className="bg-sky-600 text-white font-bold py-2 px-4 rounded-md shadow-md"
              >
                Lưu
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
