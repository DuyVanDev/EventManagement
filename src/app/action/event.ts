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

