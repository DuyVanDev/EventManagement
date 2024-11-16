"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

import { useEffect } from "react";
import { EV_spEvent_Save, EV_spEventType_Save } from "@/app/action/event";
import { fetchFacultySave } from "@/app/action/faculty";
import { Alertsuccess, Alertwarning } from "@/utils/Notifications";

const schema = z.object({
  Id: z.number(),
  EventTypeName: z
    .string()
    .min(2, { message: "Tên loại sự kiện phải có ít nhất 2 ký tự" }),
});

type Inputs = z.infer<typeof schema>;

const EventTypeForm = ({
  type,
  data,
  setOpen,
  onActionComplete,
  onActionDelete,
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
      Id: data.Id,
      EventTypeName: data.EventTypeName,
    },
  });

  useEffect(() => {
    if (data) {
      setValue("Id", data.Id);
      setValue("EventTypeName", data.EventTypeName);
    }
  }, [data, setValue]);
  const onSubmit = handleSubmit(async (dataform) => {
    try {
      const pr = {
        Id: dataform?.Id,
        EventTypeName: dataform?.EventTypeName,
      };
      const result = await EV_spEventType_Save(pr);
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
      <h1 className="text-xl font-semibold">Thêm mới loại sự kiện</h1>

      <div className="grid grid-cols-1 gap-4">
        <InputField
          label="Tên loại sự kiện"
          name="EventTypeName"
          defaultValue={data?.EventTypeName}
          register={register}
          error={errors?.EventTypeName}
        />
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tạo" : "Sửa"}
      </button>
    </form>
  );
};

export default EventTypeForm;
