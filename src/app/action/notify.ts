import { fetchMethod } from "./fetchFunctions";

interface EV_spNotification_Save {
    NotificationId?: number;
    Title?: string;
    SendFrom?: number;
    SendTo?: any;
  }
  
  export const EV_spNotification_Save = async (data: EV_spNotification_Save) => {
    try {
      return await fetchMethod(data, "EV_spNotification_Save");
    } catch (error) {}
  };
  

  
interface EV_spNotificationQueue_GET {
  Id?: number;
  UserId: number;
}

export const EV_spNotificationQueue_GET = async (data: EV_spNotificationQueue_GET) => {
  try {
    return await fetchMethod(data, "EV_spNotificationQueue_GET");
  } catch (error) {}
};
