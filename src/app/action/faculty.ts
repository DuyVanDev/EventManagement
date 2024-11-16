import { fetchMethod } from "./fetchFunctions";

interface FetchFaculty {
    FacultyId?: any;
  }
  
  export const fetchFaculty = async (data: FetchFaculty) => {
    try {
      return await fetchMethod(data, "EV_spFaculty_Select");
    } catch (error) {}
  };

   
  export const fetchFacultyList = async (data: FetchFaculty) => {
    try {
      return await fetchMethod(data, "EV_spFaculty_List");
    } catch (error) {}
  };

  interface FetchFacultySave {
    FacultyId?: number;
    FacultyName?: string;
  }

  export const fetchFacultySave = async (data: FetchFacultySave) => {
    try {
      return await fetchMethod(data, "EV_spFaculty_Save");
    } catch (error) {}
  };
  
  
  
  interface EV_spFaculty_Delete {
    FacultyId?: number;
  }

  export const EV_spFaculty_Delete = async (data: EV_spFaculty_Delete) => {
    try {
      return await fetchMethod(data, "EV_spFaculty_Delete");
    } catch (error) {}
  };
  
  
  