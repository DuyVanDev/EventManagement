import { fetchMethod } from "./fetchFunctions";

//#region  lấy dữ liệu địa điểm
interface FetchLocation {
  Id?: number;
}

export const fetchLocation = async (data: FetchLocation) => {
  try {
    return await fetchMethod(data, "EV_spLocation_Select");
  } catch (error) {}
};

interface FetchLocationList {
  LocationId?: any;
}

export const fetchLocaitonList = async (data: FetchLocationList) => {
  try {
    return await fetchMethod(data, "EV_spLocation_List");
  } catch (error) {}
};

interface FetchLocationSave {
  LocationId?: number;
  LocationName?: string;
}

export const fetchLocationSave = async (data: FetchLocationSave) => {
  try {
    return await fetchMethod(data, "EV_spLocation_Save");
  } catch (error) {}
};
