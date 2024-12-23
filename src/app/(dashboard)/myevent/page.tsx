"use client";
import {
  EV_spEventStudent_Save,
  EV_spEventStudentRegisted_List,
} from "@/app/action/event";
import CalendarStudent from "@/components/CalendarStudent";
import { useAuth } from "@/context/AuthContext";
import { Alerterror, Alertsuccess, Alertwarning } from "@/utils";
import { CallUploadImage } from "@/utils/CallUploadImage";
import ImgMutilUploadComp from "@/utils/ImgMutilUpload";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

const transformApiData = (event) => {
  const [startDate, startTime] = event.StartTime.split(" ");
  const [startDay, startMonth, startYear] = startDate.split("/");
  const [startHour, startMinute] = startTime.split(":");

  const [endDate, endTime] = event.EndTime.split(" ");
  const [endDay, endMonth, endYear] = endDate.split("/");
  const [endHour, endMinute] = endTime.split(":");

  return {
    title: event.EventName,
    allDay: false, // Hoặc true nếu sự kiện diễn ra cả ngày
    start: new Date(
      parseInt(startYear),
      parseInt(startMonth) - 1,
      parseInt(startDay),
      parseInt(startHour),
      parseInt(startMinute)
    ),
    end: new Date(
      parseInt(endYear),
      parseInt(endMonth) - 1,
      parseInt(endDay),
      parseInt(endHour),
      parseInt(endMinute)
    ),
    locationName: event.LocationName,
    studentJoin: event.StudentCount,
    eventId: event.EventId,
  };
};

const fetcherRegisted = (params: object) =>
  EV_spEventStudentRegisted_List(params);

const StudentPage = () => {
  const { user } = useAuth();

  const { data: ListDataRegisted, mutate } = useSWR(
    { UserId: user?.UserId },
    fetcherRegisted
  );
  const [LstData, setLstData] = useState([]);

  const [isModalViewOpen, setIsModalViewOpen] = useState(false);

  const openModalView = () => setIsModalViewOpen(true);
  const closeModalView = () => {
    setIsModalViewOpen(false)
    setDataProof(null)
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false) 
    setDataProof(null)
  };

  const [images, setimages] = useState("");
  const [uploadedProof, setUploadedProof] = useState([]);
  const handleProofUpload = (images) => {
    // images là danh sách file hình ảnh từ input
    setUploadedProof(images);
  };

  useEffect(() => {
    const transformedEvents = ListDataRegisted?.map(transformApiData);
    setLstData(transformedEvents);
  }, [ListDataRegisted]);

  const [dataProof, setDataProof] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const ClearDataProof = () => {
    setDataProof(null);
    setUploadedProof([]);
    setimages("");
  };

  const EV_spEventStudent_Save_FC = async () => {
    setIsLoading(true);
    try {
      if (uploadedProof.length == 0) {
        Alertwarning("Vui lòng cập nhật hình ảnh");
        setIsLoading(false);
        return;
      }
      let _newThumnail = "";
      if (uploadedProof.length > 0 && Array.isArray(uploadedProof)) {
        let listimage = "";
        if (
          uploadedProof !== "" &&
          uploadedProof.length > 0 &&
          Array.isArray(uploadedProof)
        ) {
          listimage = await CallUploadImage(uploadedProof);
        }
        _newThumnail = listimage[0]?.url;
      } else if (
        typeof uploadedProof === "string" ||
        uploadedProof.length === 0
      ) {
        _newThumnail = dataProof?.ProofImage;
      } else if (!_newThumnail) {
        Alerterror("File error");
        setIsLoading(false);
        return;
      }
      const pr = {
        Id: dataProof?.EventStudentId,
        ProofImage: _newThumnail,
      };
      const result = await EV_spEventStudent_Save(pr);
      if (result.Status == "OK") {
        Alertsuccess(result.ReturnMess);
        closeModal();
        setIsLoading(false);
        ClearDataProof();
      } else {
        Alertwarning(result.ReturnMess);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full">
      <div className="container mx-auto p-4 h-full">
        {/* <div className="flex gap-4 mb-4">
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 rounded-md ${
              viewMode === "calendar"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Dạng lịch
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-md ${
              viewMode === "list"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Dạng danh sách
          </button>
        </div> */}
        <div className="flex h-full">
          {/* Main Content */}
          <div className="w-2/3 pr-8 ">
            {/* <div className=" pt-4 shadow-lg  bg-transparent gap-2 h-full">
              <p>Lịch</p>
              <CalendarStudent Data={LstData} mutate={mutate}/>
            </div> */}
            <CalendarStudent Data={LstData} mutate={mutate} />
          </div>
          {/* Sidebar */}
          <div className="w-1/3 shadow-lg p-3">
            {/* <p className="text-lg  font-semibold p-2">Sự kiện đã đăng ký</p> */}

            <div className="bg-white p-4 rounded-md">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Sự kiện tham gia</h1>
              </div>
              {Array.isArray(ListDataRegisted) &&
                ListDataRegisted?.map((item, index) => {
                  return (
                    <div
                      key={item?.EventId}
                      className="flex flex-col gap-4 mt-4"
                    >
                      <div className="bg-lamaSkyLight rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/blog/${item?.EventId}`}
                            className="font-medium text-base hover:underline"
                          >
                            {item?.EventName}
                          </Link>
                          <span className="text-xs bg-white rounded-md px-1 py-1">
                            {item?.StartTime}
                          </span>
                        </div>
                        <div
                          className="text-sm text-gray-400 mt-1 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: item?.EventDescription,
                          }}
                        />
                        <p className="mt-3 text-right">
                          {item?.IsRegistrationOpen == 0 &&
                            (!item?.ProofImage || item?.ProofImage == "") && (
                              <p
                                onClick={() => {
                                  openModal();
                                  // console.log
                                  setDataProof(item);
                                }}
                                className="text-red-500 text-sm font-semibold hover:underline cursor-pointer"
                              >
                                Cập nhật minh chứng
                              </p>
                            )}

                          {(item?.ProofImage || item?.ProofImage != "") && (
                            <p
                              onClick={() => {
                                openModalView();
                                // console.log
                                setDataProof(item);
                              }}
                              className="text-blue-500 text-sm font-semibold hover:underline cursor-pointer"
                            >
                              Xem minh chứng
                            </p>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">
              Minh Chứng {dataProof.EventName}
            </h2>
            <ImgMutilUploadComp
              data={images}
              label="Tải hình ảnh"
              onData={setimages} // Hàm xử lý khi xóa ảnh
              onImageUpload={handleProofUpload} // Hàm xử lý khi chọn ảnh
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mr-2"
              >
                Hủy
              </button>
              <button
                onClick={() => EV_spEventStudent_Save_FC()}
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                  isLoading ? "cursor-not-allowed opacity-75" : ""
                }`}
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
                  "Lưu"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalViewOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
            <h2 className="text-lg font-bold mb-4">
              Minh Chứng {dataProof.EventName}
            </h2>
            <div className="flex items-center justify-center p2">
              <Image
                src={dataProof.ProofImage}
                width={500}
                height={500}
                alt="Hình ảnh minh chứng"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModalView}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mr-2"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPage;
