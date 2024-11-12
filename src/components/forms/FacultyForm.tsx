"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

import { useEffect } from "react";
import { EV_spEvent_Save } from "@/app/action/event";
import { fetchFacultySave } from "@/app/action/faculty";
import { Alertsuccess, Alertwarning } from "@/utils/Notifications";

const schema = z.object({
  FacultyId: z.number(),
  FacultyName: z
    .string()
    .min(6, { message: "Tên khoa-viện phải có ít nhất 6 ký tự" }),
});

type Inputs = z.infer<typeof schema>;

const FacultyForm = ({
  type,
  data,
  setOpen,
  onActionComplete,
}: {
  type: "create" | "update";
  data?: any;
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
      FacultyId: data.FacultyId,
      FacultyName: data.FacultyName,
    },
  });

  useEffect(() => {
    if (data) {
      setValue("FacultyId", data.FacultyId);
      setValue("FacultyName", data.FacultyName);
    }
  }, [data, setValue]);
  const onSubmit = handleSubmit(async (dataform) => {
    try {
      const pr = {
        FacultyId: dataform?.FacultyId,
        FacultyName: dataform?.FacultyName,
      };
      const result = await fetchFacultySave(pr);
      if (result.Status == "OK") {
        Alertsuccess(result.ReturnMess);
        setOpen(false);
        onActionComplete(); 
      } else {
        Alertwarning(result.ReturnMess);
      }
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Thêm mới Khoa - Viện</h1>

      <div className="grid grid-cols-1 gap-4">
        <InputField
          label="Tên Khoa - Viện"
          name="FacultyName"
          defaultValue={data?.FacultyName}
          register={register}
          error={errors?.FacultyName}
        />
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tạo" : "Sửa"}
      </button>
    </form>
  );
};

export default FacultyForm;
