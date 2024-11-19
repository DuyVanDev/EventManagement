"use client";
import InputField from "@/components/InputField";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  Username: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập!" }),
  Password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
});

type Inputs = z.infer<typeof schema>;

const LoginPage = () => {
  const { login, user } = useAuth();
  console.log(user);
  const {
    register,
    handleSubmit,
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
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-md transition duration-300 hover:bg-blue-700 focus:outline-none"
          >
            Đăng nhập
          </button>
          <p className="text-right mt-2 text-sm font-light">Bạn chưa có tài khoản hãy <Link className="text-sky-600 hover:underline" href={"/register"}>Đăng ký</Link> </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
