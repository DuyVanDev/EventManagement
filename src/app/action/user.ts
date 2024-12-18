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

interface EV_spStudent_Save {
  UserId?: any;
  UserName: string;
  FullName: string;
  PhoneNumber: string;
  Address: string;
  BirthDay: string;
  Specialty: number;
  Password: string;
  Email: string;
  Sex : number;
}

export const EV_spStudent_Save = async (data: EV_spStudent_Save) => {
  try {
    return await fetchMethod(data, "EV_spStudent_Save");
  } catch (error) {}
};

interface EV_spUser_ForgotPassword {
  Email: string;
  Password: string;
}

export const EV_spUser_ForgotPassword = async (
  data: EV_spUser_ForgotPassword
) => {
  try {
    return await fetchMethod(data, "EV_spUser_ForgotPassword");
  } catch (error) {}
};

interface EV_spCheckEmail_Exist {
  Email: string;
}

export const EV_spCheckEmail_Exist = async (
  data: EV_spCheckEmail_Exist
) => {
  try {
    return await fetchMethod(data, "EV_spCheckEmail_Exist");
  } catch (error) {}
};


interface EV_spUser_Save {
  UserId?: any;
  UserName: string;
  FullName: string;
  PhoneNumber: string;
  Address: string;
  BirthDay: string;
  Specialty: number;
  Password: string;
  Email: string;
  Sex: number
}

export const EV_spUser_Save = async (data: EV_spUser_Save) => {
  try {
    return await fetchMethod(data, "EV_spUser_Save");
  } catch (error) {}
};

interface EV_spChangePassword_Save {
  UserId?: any;
  NewPassword: string;
  CurrentPassword: string;
}

export const EV_spChangePassword_Save = async (data: EV_spChangePassword_Save) => {
  try {
    return await fetchMethod(data, "EV_spChangePassword_Save");
  } catch (error) {}
};

interface EV_spUser_Delete {
  UserId?: number;
}

export const EV_spUser_Delete = async (data: EV_spUser_Delete) => {
  try {
    return await fetchMethod(data, "EV_spUser_Delete");
  } catch (error) {}
};