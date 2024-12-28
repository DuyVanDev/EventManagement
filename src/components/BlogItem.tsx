"use client";
import { EV_spEventStudent_Register } from "@/app/action/event";
import { useAuth } from "@/context/AuthContext";
import {
  Alertsuccess,
  Alertwarning,
  CalculateTimeAgo,
  FormatDateJsonPro,
} from "@/utils";
import Image from "next/image";
import Link from "next/link";

const BlogItem = ({ post, onMutate }) => {
  const { user } = useAuth();

  const handleRegisterEvent = async (item) => {
    try {
      const pr = {
        EventId: item?.EventId,
        StudentId: user?.UserId,
        AttendanceStatus: 0,
      };
      const res = await EV_spEventStudent_Register(pr);
      if (res?.Status == "OK") {
        Alertsuccess(res?.ReturnMess);
        onMutate()
      } else {
        Alertwarning(res?.ReturnMess);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex flex-col xl:flex-row gap-3 mb-4 shadow-lg bg-white border-sky-200 border-[1px] rounded-lg hover:bg-sky-50 p-2">
      {/* image */}
      <Link href={`blog/${post.EventId}`} className="md:hidden xl:block xl:w-1/3 w-[300px] h-[200px]">
        <Image
          src={post.Thumnail != "" ? post.Thumnail : "/showimg.png"}
          alt="Article"
          className="rounded-lg w-full h-full"
          width={300}
          height={150}
        />
      </Link>
      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3 cursor-pointer p-2">
        <Link href={`blog/${post.EventId}`} className="text-xl font-semibold">
          {post.EventName}
        </Link>
        <div className="flex flex-col h-full gap-2 pt-1 pb-4 ">
          <div className="flex md:flex-row flex-col md:items-center items-start gap-2 text-gray-400 text-sm">
            {/* <span>Đăng bởi: </span> */}
            {/* <p className="text-blue-800 ">{post?.CreaterName}</p> */}
            <span className="text-gray-400">
              Ngày tổ chức: {FormatDateJsonPro(post?.StartTime, 7)}
            </span>

            <p className="text-white bg-blue-500 rounded-lg px-2 font-semibold">
              {post.EventTypeName}
            </p>
          </div>
          <div
            className="font-normal text-inherit grow line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: post.EventDescription,
            }}
          ></div>

          <div className="flex items-center gap-3 md:justify-start justify-center">
            <span className="text-sm bg-gray-200 w-fit px-2 rounded-md">
              {CalculateTimeAgo(post.CreateDate)}
            </span>
            {/* post?.IsRegistrationOpen == 0 && */}
            {
              (post?.IsRegister == 1 || post?.IsRegister == null) &&
              user?.RoleTmp == "student" && (
                <button
                  onClick={() => handleRegisterEvent(post)}
                  className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 w-fit"
                >
                  Đăng ký
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
