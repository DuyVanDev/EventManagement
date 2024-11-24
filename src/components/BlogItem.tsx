"use client";
import { EV_spEventStudent_Register } from "@/app/action/event";
import { useAuth } from "@/context/AuthContext";
import { Alertsuccess, CalculateTimeAgo, FormatDateJsonPro } from "@/utils";
import Image from "next/image";
import Link from "next/link";

const BlogItem = ({ post }) => {
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
      } else {
        Alertwarning + res?.ReturnMess;
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Link
      href={`blog/${post.EventId}`}
      className="flex flex-col xl:flex-row gap-8 mb-12 shadow-lg"
    >
      {/* image */}
      {post.Thumnail && (
        <div className="md:hidden xl:block xl:w-1/3">
          <Image
            src={post.Thumnail}
            alt="Article"
            className="rounded-lg"
            width={300}
            height={150}
          />
        </div>
      )}
      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3 cursor-pointer">
        <Link href={`blog/${post.EventId}`} className="text-2xl font-semibold">
          {post.EventName}
        </Link>
        <div className="flex flex-col h-full gap-2 pt-1 pb-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Đăng bởi</span>
            <p className="text-blue-800">{post?.CreaterName}</p>
            <span>Ngày tổ chức: {FormatDateJsonPro(post?.StartTime, 10)}</span>

            <p className="text-white bg-blue-300 rounded-lg px-2 font-semibold">
              {post.EventTypeName}
            </p>
          </div>
          <div
            className="font-normal text-inherit grow line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: post.EventDescription,
            }}
          ></div>

          <div className="flex items-center gap-3">
            <span className="text-sm bg-gray-200 w-fit px-2 rounded-md">
              {CalculateTimeAgo(post.CreateDate)}
            </span>
            {post?.IsRegistrationOpen == 0 &&
              post?.IsRegister == 0 &&
              user?.RoleTmp == "student" && (
                <button
                  onClick={() => handleRegisterEvent(post)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 w-fit"
                >
                  Đăng ký
                </button>
              )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogItem;
