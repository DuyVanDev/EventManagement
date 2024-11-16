import { fetchMethod } from "./fetchFunctions";

interface FetchTeacherSave {
  UserId?: any;
  UserName: string;
  FullName: string;
  PhoneNumber: string;
  Address: string;
  BirthDay: string;
  Specialty: number;
}

export const EV_spTeacher_Save = async (data: FetchTeacherSave) => {
  try {
    return await fetchMethod(data, "EV_spTeacher_Save");
  } catch (error) {}
};


interface EV_spTeacher_Delete {
  UserId?: number;
}

export const EV_spTeacher_Delete = async (data: FetchTeacherSave) => {
  try {
    return await fetchMethod(data, "EV_spTeacher_Delete");
  } catch (error) {}
};
