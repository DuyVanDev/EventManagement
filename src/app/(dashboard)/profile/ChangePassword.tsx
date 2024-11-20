"use client";
import { EV_spChangePassword_Save } from "@/app/action/user";
import InputField from "@/components/InputField";
import { useAuth } from "@/context/AuthContext";
import { Alerterror, Alertsuccess } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    UserId: z.any(),
    CurrentPassword: z
      .string()
      .min(1, { message: "Vui lòng nhập mật khẩu cũ" }),
    NewPassword: z.string().min(1, { message: "Vui lòng nhập mật khẩu mới" }),
    ConfirmNewPassword: z
      .string()
      .min(1, { message: "Vui lòng nhập lại mật khẩu mới" }),
  })
  .refine((data) => data.NewPassword === data.ConfirmNewPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["ConfirmNewPassword"],
  });

type Inputs = z.infer<typeof schema>;

const ChangePassword = () => {
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
      CurrentPassword: "",
      NewPassword: "",
      ConfirmNewPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (dataform) => {
    debugger;
    try {
      const pr = {
        UserId: user?.UserId,
        CurrentPassword: dataform?.CurrentPassword,
        NewPassword: dataform?.NewPassword,
      };
      const result = await EV_spChangePassword_Save(pr);
      if (result?.Status == "OK") {
        setValue("CurrentPassword", "");
        setValue("NewPassword", "");
        setValue("ConfirmNewPassword", "");
        Alertsuccess(result?.ReturnMess);
      } else {
        Alerterror(result?.ReturnMess);
      }
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <InputField
          label="Mật khẩu hiện tại"
          type="password"
          name="CurrentPassword"
          register={register}
          error={errors?.CurrentPassword}
        />
      </div>
      <div>
        <InputField
          label="Mật khẩu hiện tại"
          type="password"
          name="NewPassword"
          register={register}
          error={errors?.NewPassword}
        />
      </div>
      <div>
        <InputField
          label="Nhập lại mật khẩu mới"
          type="password"
          name="ConfirmNewPassword"
          register={register}
          error={errors?.ConfirmNewPassword}
        />
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className=" bg-sky-600 text-white font-bold py-2 px-4 rounded-md shadow-md"
        >
          Đổi mật khẩu
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;
