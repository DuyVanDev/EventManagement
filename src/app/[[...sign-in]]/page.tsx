"use client";
import InputField from "@/components/InputField";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  Username: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập!" }),
  Password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
});

type Inputs = z.infer<typeof schema>;

const LoginPage = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onSubmit = handleSubmit(async (dataform) => {
    try {
      await login(dataform.Username, dataform.Password);
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
        <div>
          <div className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Image src="/logo.png" alt="" width={24} height={24} />
              SchooLama
            </h1>
            <h2 className="text-gray-400">Sign in to your account</h2>
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

            <button className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;
