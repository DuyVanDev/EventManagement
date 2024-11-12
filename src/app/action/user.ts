import { fetchMethod } from "./fetchFunctions";

//#region  lấy dữ liệu giảng viên
interface FetchLecture {
  Id?: number;
  Specialty?: number; // Khoa của giảng viên
}

export const fetchLectureSelect = async (data: FetchLecture) => {
  try {
    return await fetchMethod(data, "EV_spLecture_Select");
  } catch (error) {}
};


interface FetchTeacher {
  Id?: any;
  Specialty?: number; // Khoa của giảng viên
}

export const fetchTeacher = async (data: FetchTeacher) => {
  try {
    return await fetchMethod(data, "EV_spTeacher_List");
  } catch (error) {}
};


interface FetchStudent {
  Id?: any;
  Specialty?: number; // Khoa của giảng viên
}

export const EV_spStudent_List = async (data: FetchStudent) => {
  try {
    return await fetchMethod(data, "EV_spStudent_List");
  } catch (error) {}
};


interface UserLogin {
  Username?: string;
  Password?: string; // Khoa của giảng viên
}
export const EV_spEvent_Login = async (data: UserLogin) => {
  try {
    return await fetchMethod(data, "EV_spEvent_Login");
  } catch (error) {}
};