"use client";
import { EV_spStudent_Save } from "@/app/action/user";
import { SelectFaculty } from "@/common";
import InputField from "@/components/InputField";
import { useAuth } from "@/context/AuthContext";
import { Alerterror, Alertsuccess } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    UserName: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập!" }),
    FullName: z.string().min(1, { message: "Vui lòng nhập họ và tên!" }),
    Password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    ConfirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu" }),
    PhoneNumber: z
      .string()
      .min(10, { message: "Số điện thoại phải có ít nhất 10 chữ số" }),
    Email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ" }),
    Address: z.string().min(1, { message: "Vui lòng nhập địa chỉ" }),
    BirthDay: z.string().min(1, { message: "Vui lòng chọn ngày sinh" }),
    Specialty: z.any(),
    Sex : z.any()
  })
  .refine((data) => data.Password === data.ConfirmPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["ConfirmPassword"],
  });
type Inputs = z.infer<typeof schema>;

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      UserId: 0,
      UserName: "",
      Password: "",
      FullName: "",
      PhoneNumber: "",
      Address: "",
      BirthDay: new Date(),
      Specialty: "",
      Email: "",
      Sex: 1
    },
  });

  const onSubmit = handleSubmit(async (dataform) => {
    setIsLoading(true);
    try {
      const pr = {
        UserId: 0,
        UserName: dataform?.UserName,
        Password: dataform?.Password,
        FullName: dataform?.FullName,
        Email: dataform?.Email,
        PhoneNumber: dataform?.PhoneNumber,
        Address: dataform?.Address,
        BirthDay: dataform?.BirthDay,
        Specialty: dataform?.Specialty,
        Sex: dataform?.Sex
      };
      const result = await EV_spStudent_Save(pr);
      if (result?.Status == "OK") {
        setValue("UserId", 0);
        setValue("UserName", "");
        setValue("Password", "");
        setValue("ConfirmPassword", "");
        setValue("FullName", "");
        setValue("PhoneNumber", "");
        setValue("Address", "");
        setValue("BirthDay", new Date());
        setValue("Specialty", 0);
        setValue("Email", "");
        setValue("Sex", 1);
        setIsLoading(false);

        Alertsuccess(result?.ReturnMess);
      } else {
        Alerterror(result?.ReturnMess);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div
      className="h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-login.jfif')" }}
    >
      <form
        className="h-full flex items-center justify-center"
        onSubmit={onSubmit}
      >
        <div className="bg-white p-10 rounded-lg shadow-xl max-w-sm w-full">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2 flex items-center gap-2 justify-center">
              <Image src="/logo.png" alt="Logo" width={30} height={30} />
              <span className="ml-2">Sự kiện TDMU</span>
            </div>
            <h2 className="text-gray-500 mb-2 text-lg">Đăng ký</h2>
          </div>

          <InputField
            label="Tên đăng nhập"
            name="UserName"
            register={register}
            error={errors?.Username}
          />

          <InputField
            label="Họ và tên"
            name="FullName"
            register={register}
            error={errors?.FullName}
          />

          <InputField
            label="Mật khẩu"
            type="password"
            name="Password"
            register={register}
            error={errors?.Password}
          />

          <InputField
            label="Nhập lại mật khẩu"
            type="password"
            name="ConfirmPassword"
            register={register}
            error={errors?.ConfirmPassword}
          />

          <InputField
            label="Số điện thoại"
            type="number"
            name="PhoneNumber"
            register={register}
            error={errors?.PhoneNumber}
          />

          <InputField
            label="Email"
            type="email"
            name="Email"
            register={register}
            error={errors?.Email}
          />

          <InputField
            label="Địa chỉ"
            type="text"
            name="Address"
            register={register}
            error={errors?.Address}
          />

          <InputField
            label="Ngày sinh"
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
                  onSelected={(selected) => {
                    onChange(selected.value);
                  }}
                  FacultyId={0}
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

          <button
            className={`bg-blue-600 text-white w-full py-2 mt-4 rounded flex items-center hover:bg-blue-700 justify-center gap-2 ${
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
            ) : (
              "Đăng ký"
            )}
          </button>
          <p className="text-center mt-2 text-sm font-light">
            Bạn đã có tài khoản hãy{" "}
            <Link className="text-sky-600 hover:underline" href={"/"}>
              Đăng nhập
            </Link>{" "}
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
