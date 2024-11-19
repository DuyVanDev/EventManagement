"use client";
import { sendMail } from "@/app/action/sendnotify";
import {
  EV_spCheckEmail_Exist,
  EV_spStudent_Save,
  EV_spUser_ForgotPassword,
} from "@/app/action/user";
import { SelectFaculty } from "@/common";
import InputField from "@/components/InputField";
import { useAuth } from "@/context/AuthContext";
import { Alerterror, Alertsuccess, GeneratePassword } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  Email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ" }),
});

type Inputs = z.infer<typeof schema>;

const ForgotPassword = () => {
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
      Email: "",
    },
  });

  const onSubmit = handleSubmit(async (dataform) => {
    setIsLoading(true);
    try {
      const pr = {
        Email: dataform?.Email,
      };
      const result = await EV_spCheckEmail_Exist(pr);
      if (result?.Status == "OK") {
        const newPassword = GeneratePassword(9);
        await sendMail({
          toEmail: dataform?.Email,
          subject: "Thông báo cấp lại mật khẩu",
          body: `Mật khẩu mới của bạn là : ${newPassword}`,
        });
        const pr2 = {
          Email: dataform?.Email,
          Password: newPassword,
        };
        const res = await EV_spUser_ForgotPassword(pr2);
        if (res.Status == "OK") {
          Alertsuccess(res?.ReturnMess);
          setValue("Email", "");
          setIsLoading(true);
          return;
        } else {
          Alerterror(res?.ReturnMess);
          setIsLoading(true);
        }
      } else {
        Alerterror(result?.ReturnMess);
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
            <h2 className="text-gray-500 mb-2 text-lg">Quên mật khẩu</h2>
          </div>

          <InputField
            label="Email"
            type="email"
            name="Email"
            register={register}
            error={errors?.Email}
          />

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
              "Gửi"
            )}
          </button>
          <p className="text-right mt-2 text-sm font-light">
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

export default ForgotPassword;
