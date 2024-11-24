"use client";
import { EV_spStudent_Save } from "@/app/action/user";
import { SelectFaculty } from "@/common";
import InputField from "@/components/InputField";
import { useAuth } from "@/context/AuthContext";
import { Alerterror, Alertsuccess } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
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
    Specialty: z.number(),
  })
  .refine((data) => data.Password === data.ConfirmPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["ConfirmPassword"],
  });
type Inputs = z.infer<typeof schema>;

const RegisterPage = () => {
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
      UserId: 0,
      UserName: "",
      Password: "",
      FullName: "",
      PhoneNumber: "",
      Address: "",
      BirthDay: new Date(),
      Specialty: "",
      Email: "",
    },
  });

  const onSubmit = handleSubmit(async (dataform) => {
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

        Alertsuccess(result?.ReturnMess);
      } else {
        Alerterror(result?.ReturnMess);
      }
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
            <div className="text-lg font-semibold mb-2 flex items-center gap-2 justify-center">
              <Image src="/logo.png" alt="Logo" width={30} height={30} />
              <span className="ml-2">Sự kiện TDMU</span>
            </div>
            <h2 className="text-gray-500 mb-2 text-lg">Đăng ký tài khoản</h2>
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
                  onSelected={(selected) =>{
                    onChange(selected.value)
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

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-md transition duration-300 hover:bg-blue-700 focus:outline-none"
          >
            Đăng nhập
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

export default RegisterPage;
