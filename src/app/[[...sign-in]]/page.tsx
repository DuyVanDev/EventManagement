"use client";
import InputField from "@/components/InputField";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  Username: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập!" }),
  Password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
});

type Inputs = z.infer<typeof schema>;

const LoginPage = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (dataform) => {
    setIsLoadingButton(true);
    try {
      const result = await login(dataform.Username, dataform.Password);
      if (result?.Status == "OK") {
        // show màn hình chờ
        setIsLoading(true); // Hiển thị màn hình flash
        setIsLoadingButton(false);

        setTimeout(() => {
          setIsLoading(false); // Ẩn màn hình flash sau 5 giây
        }, 5000);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingButton(false);
    }
  });

  return (
    <div
      className="h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-login.jfif')" }}
    >
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center">
            <Image
              src="/loading.webp"
              alt="Loading..."
              width={50}
              height={50}
            />
          </div>
        </div>
      )}
      <form
        className="h-full flex items-center justify-center"
        onSubmit={onSubmit}
      >
        <div className="bg-white p-10 rounded-lg shadow-xl max-w-sm w-full">
          <div className="text-center">
            <div className="text-lg font-semibold mb-4 flex items-center gap-2 justify-center">
              <Image src="/logo.png" alt="Logo" width={30} height={30} />
              <span className="ml-2">Sự kiện TDMU</span>
            </div>
            <h2 className="text-gray-500 mb-6">
              Đăng nhập bằng tài khoản của bạn
            </h2>
          </div>

          <InputField
            label="Tên đăng nhập"
            name="Username"
            register={register}
            error={errors?.Username}
          />
          <InputField
            label="Mật khẩu"
            type="password"
            name="Password"
            register={register}
            error={errors?.Password}
          />

          <button
            className={`bg-blue-600 text-white w-full py-2 mt-4 rounded flex items-center hover:bg-blue-700 justify-center gap-2 ${
              isLoadingButton ? "cursor-not-allowed opacity-75" : ""
            }`}
            type="submit"
            disabled={isLoadingButton}
          >
            {isLoadingButton ? (
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
              " Đăng nhập"
            )}
          </button>

          <p className="text-center mt-2 text-sm font-light">
            Bạn chưa có tài khoản hãy{" "}
            <Link className="text-sky-600 hover:underline" href={"/register"}>
              Đăng ký
            </Link>{" "}
          </p>

          <p className="text-center mt-2 text-sm font-light">
            <Link className="text-gray-600 hover:underline" href={"/forgotpassword"}>
              Quên mật khẩu
            </Link>{" "}
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
