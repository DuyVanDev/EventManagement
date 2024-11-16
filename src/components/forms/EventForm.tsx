"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import {
  SelectDateTimeRangePicker,
  SelectLecture,
  SelectLocation,
} from "@/common";
import { SelectEventType } from "@/common/SelectTypeEvent";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Đảm bảo có file CSS của ReactQuill
import { EV_spEvent_Save, fetchEventList } from "@/app/action/event";
import { Alerterror, Alertsuccess, Alertwarning } from "@/utils/Notifications";
import { FormatDateJsonPro } from "@/utils/FormatDateJson";
import ImgMutilUploadComp from "@/utils/ImgMutilUpload";
import { CallUploadImage } from "@/utils/CallUploadImage";

const schema = z.object({
  EventId: z.number(),
  EventName: z
    .string()
    .min(5, { message: "Tên sự kiện phải có ít nhất 5 ký tự!" }),
  EventDescription: z.string().min(1, { message: "Hãy nhập mô tả sự kiện!" }),
  ParticipantLimit: z.any(),
  Time: z.any(),
  LectureId: z.any(),
  LocationId: z.number().min(1, { message: "Vui lòng chọn địa điểm!" }),
  EventTypeId: z.number().min(1, { message: "Vui lòng chọn loại sự kiện!" }),
  LecturerId: z.any(),
  Thumnail: z.any(),
  ListImage: z.any(),
});

type Inputs = z.infer<typeof schema>;

const EventForm = ({
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
      EventId: data.EventId,
      EventName: data.EventName,
      EventDescription: data.EventDescription,
      Time: [data.StartTime, data.EndTime],
      LocationId: data.LocationId,
      LectureId: data.LecturerId,
      EventTypeId: data.EventTypeId,
      ParticipantLimit: data.ParticipantLimit,
      Thumnail: data.Thumnail,
      ListImage: data?.ListImage?.split(";").filter(Boolean) || [],
    },
  });
  //#region  thumnail
  const [imagesThumnail, setImagesThumnail] = useState(data?.Thumnail);
  const [uploadedThumnail, setUploadedThumnail] = useState([]);

  const [flag, setFlag] = useState(0); // flag để reset hoặc xử lý khác
  const [isReset, setIsReset] = useState(0); // kiểm soát việc reset form upload
  const [isMutil, setIsMutil] = useState(false); // cho phép upload nhiều ảnh
  const handleThumnailUpload = (images) => {
    // images là danh sách file hình ảnh từ input
    setUploadedThumnail(images);
  };

  //#endregion

  // #region danh sach ảnh
  const [images, setImages] = useState(data?.ListImage ? data?.ListImage?.split(';') : []);
  const [uploadedListImage, setUploadedListImage] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedListImage(files);
  };
  const combinedImages = [...images, ...uploadedListImage];


  // #endregion
  useEffect(() => {
    if (data) {
      setValue("EventName", data.EventName);
      setValue("EventDescription", data.EventDescription);
      setValue("ParticipantLimit", data.ParticipantLimit);
      setValue("Time", [data.StartTime, data.EndTime]);
      setValue("Thumnail", data.Thumnail);
      setValue("ListImage", data?.ListImage?.split(";").filter(Boolean) || []);
    }
  }, [data, setValue]);

  const ClearData = () => {
    setValue("EventId", 0);
    setValue("EventName", "");
    setValue("EventDescription", "");
    setValue("ParticipantLimit", 0);
    setValue("Thumnail", "");
    setValue("ListImage", null);
    setImagesThumnail("");
    setUploadedThumnail([]);
    setIsReset(Math.random());
  };

  const onSubmit = handleSubmit(async (dataform) => {
    debugger;
    try {
      let _newThumnail = "";
      if (uploadedThumnail.length > 0 && Array.isArray(uploadedThumnail)) {
        let listimage = "";
        if (
          uploadedThumnail !== "" &&
          uploadedThumnail.length > 0 &&
          Array.isArray(uploadedThumnail)
        ) {
          listimage = await CallUploadImage(uploadedThumnail);
          console.log(listimage);
        }
        _newThumnail = listimage[0]?.url;
      } else if (
        typeof uploadedThumnail === "string" ||
        uploadedThumnail.length === 0
      ) {
        _newThumnail = data?.Thumnail;
      } else if (!_newThumnail) {
        Alerterror("File error");
        return;
      }
      let _newListImage = "";
      if (uploadedListImage.length > 0 && Array.isArray(uploadedListImage)) {
        let listimage = "";
        if (
          uploadedListImage !== "" &&
          uploadedListImage.length > 0 &&
          Array.isArray(uploadedListImage)
        ) {
          listimage = await CallUploadImage(combinedImages);
        }
        _newListImage = listimage
          .filter((p) => p !== "" && p !== undefined && p !== "undefined")
          .map((item) => item.url)
          .join(";");
      } else if (
        typeof uploadedListImage === "string" ||
        uploadedListImage.length === 0
      ) {
        _newListImage = data?.ListImage;
      } else if (!_newListImage) {
        Alerterror("File error");
        return;
      }
      const pr = {
        EventId: dataform?.EventId,
        EventName: dataform?.EventName,
        EventDescription: dataform?.EventDescription,
        StartTime: FormatDateJsonPro(dataform?.Time[0], 23),
        EndTime: FormatDateJsonPro(dataform?.Time[1], 23),
        LocationId: dataform?.LocationId,
        LectureId: dataform?.LecturerId,
        EventTypeId: dataform?.EventTypeId,
        ParticipantLimit: dataform?.ParticipantLimit,
        Thumnail: _newThumnail,
        ListImage: _newListImage,
      };
      const result = await EV_spEvent_Save(pr);
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
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Thêm mới sự kiện</h1>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Tên sự kiện"
          name="EventName"
          defaultValue={data?.EventName}
          register={register}
          error={errors?.EventName}
        />

        <div>
          <Controller
            name="LocationId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectLocation
                onSelected={(selected) => onChange(selected.value)}
                label="Địa điểm"
                Id={data?.LocationId}
                onActive={data?.LocationId}
              />
            )}
          />
          {errors.LocationId && (
            <span className="text-red-500 text-sm">
              {errors.LocationId.message}
            </span>
          )}
        </div>

        <div>
          <Controller
            name="EventTypeId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectEventType
                onSelected={(selected) => onChange(selected.value)}
                label="Loại sự kiện"
                onActive={data.EventTypeId}
              />
            )}
          />
          {errors.EventTypeId && (
            <span className="text-red-500 text-sm">
              {errors.EventTypeId.message}
            </span>
          )}
        </div>

        <div>
          <Controller
            name="LecturerId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectLecture
                onActive={data.LecturerId}
                onSelected={(selected) => onChange(selected)}
                label="Chọn giảng viên"
                multiple={true}
              />
            )}
          />
          {errors.LecturerId && (
            <span className="text-red-500 text-sm">
              {errors.LecturerId.message}
            </span>
          )}
        </div>

        <InputField
          label="Số lượng"
          type="number"
          defaultValue={data?.ParticipantLimit}
          name="ParticipantLimit"
          register={register}
          error={errors.ParticipantLimit}
        />

        <div>
          <Controller
            name="Time"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectDateTimeRangePicker
                label="Thời gian"
                onSelected={onChange}
                value={value}
                isRequired={true}
              />
            )}
          />
          {errors.Time && (
            <span className="text-red-500">
              {errors.Time.message as string}
            </span>
          )}
        </div>
        <div>
          <ImgMutilUploadComp
            data={imagesThumnail}
            label="Chọn thumnail"
            onData={setImagesThumnail} // Hàm xử lý khi xóa ảnh
            onImageUpload={handleThumnailUpload} // Hàm xử lý khi chọn ảnh
            flag={flag}
            isReset={isReset}
            isMutil={isMutil}
          />
        </div>
        <div className="max-w-md mx-auto">
          {/* Input tải ảnh lên */}
          <input
            type="file"
            id="imageInput"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="imageInput"
            className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tải ảnh lên
          </label>

          {/* Khu vực hiển thị ảnh đã tải lên */}
          <div className="flex space-x-2 mt-4">
            {combinedImages.length > 0 ? (
              combinedImages.slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 rounded overflow-hidden"
                >
                  <img
                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="relative w-20 h-20 rounded overflow-hidden">
                <img
                  src="/showimg.png" // Đường dẫn tới ảnh placeholder
                  alt="No image"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Hiển thị số lượng ảnh còn lại nếu có */}
            {combinedImages.length > 3 && (
              <div className="relative w-20 h-20 rounded overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold text-lg">
                  +{combinedImages.length - 3}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-2">
          <label className="block font-medium text-gray-700">Mô tả</label>
          <Controller
            name="EventDescription"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <ReactQuill
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Nhập mô tả sự kiện..."
                />
                {errors.EventDescription && (
                  <span className="text-red-500 text-sm">
                    {errors.EventDescription.message}
                  </span>
                )}
              </div>
            )}
          />
        </div>
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md !cursor-pointer ">
        {type === "create" ? "Tạo" : "Sửa"}
      </button>
    </form>
  );
};

export default EventForm;
