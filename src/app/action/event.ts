import { fetchMethod } from "./fetchFunctions";

//#region thêm hoặc sửa event
interface Event {
  EventId: number;
  EventName : string;
  EventDescription: string;
  EventDate : string;
  StartTime : Date;
  EndTime : Date;
  LocationId : number;
  LectureId : string;
  EventTypeId : number;
  ParticipantLimit : number;
}

export const EV_spEvent_Save = async (data: Event) => {
  try {
    return await fetchMethod(data, "EV_spEvent_Save");
  } catch (error) {}
};

//#region  lấy dữ liệu loại event
interface FetchEventType {
  Id?: number;
}

export const EV_spEventType_List = async (data: EV_spEventType_List) => {
  try {
    return await fetchMethod(data, "EV_spEventType_List");
  } catch (error) {}
};


interface EV_spEventType_List {
  Id?: number;
}

export const fetchEventType = async (data: FetchEventType) => {
  try {
    return await fetchMethod(data, "EV_spEventType_Select");
  } catch (error) {}
};

interface EventList {
  EventId?: any;
  StartTime? : Date;
  EndTime? : Date;
  LocationId? : number;
  LectureId? : number;
  EventTypeId? : number;
  UserId? :number;
}

export const fetchEventList = async (data: EventList) => {
  try {
    return await fetchMethod(data, "EV_spEvent_List");
  } catch (error) {}
};



interface FetchEventByTeacher {
  UserId?: number;
}

export const fetchEventByTeacher = async (data: FetchEventByTeacher) => {
  try {
    return await fetchMethod(data, "EV_spEventByTeacher_List");
  } catch (error) {}
};

interface EV_spEventStudent_Register {
  EventId?: number;
  StudentId?: number;
  AttendanceStatus?: number;
}

export const EV_spEventStudent_Register = async (data: EV_spEventStudent_Register) => {
  try {
    return await fetchMethod(data, "EV_spEventStudent_Register");
  } catch (error) {}
};



interface EV_spEventStudentRegisted_List {
  UserId? :number;
}

export const EV_spEventStudentRegisted_List = async (data: EV_spEventStudentRegisted_List) => { // Lấy danh sách sự kiện đã đăng ký
  try {
    return await fetchMethod(data, "EV_spEvent_GetByUserId");
  } catch (error) {}
};


export const EV_spUserRoleAndGenderCount = async (data: any) => { // Lấy danh sách sự kiện đã đăng ký
  try {
    return await fetchMethod(data, "EV_spUserRoleAndGenderCount");
  } catch (error) {}
};

interface EV_spEvent_Delete {
  EventId? :number;
}

export const EV_spEvent_Delete = async (data: EV_spEvent_Delete) => { // Lấy danh sách sự kiện đã đăng ký
  try {
    return await fetchMethod(data, "EV_spEvent_Delete");
  } catch (error) {}
};

interface EV_spEventType_Save {
  Id?: number;
  EventTypeName : string;
}

export const EV_spEventType_Save = async (data: EV_spEventType_Save) => {
  try {
    return await fetchMethod(data, "EV_spEventType_Save");
  } catch (error) {}
};

interface EV_spEventType_Delete {
  Id?: number;
}

export const EV_spEventType_Delete = async (data: EV_spEventType_Delete) => {
  try {
    return await fetchMethod(data, "EV_spEventType_Delete");
  } catch (error) {}
};