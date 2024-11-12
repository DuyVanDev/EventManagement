// "use client";

// import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
// import moment from "moment";
// import { calendarEvents } from "@/lib/data";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useEffect, useState } from "react";
// import "moment/locale/vi";
// import { fetchEventByTeacher } from "@/app/action/event";
// moment.locale("vi");
// const localizer = momentLocalizer(moment);

// const BigCalendar = ({ teacherId }: { teacherId: number }) => {
//   const [view, setView] = useState<View>(Views.WEEK);
//   console.log(teacherId);
//   const [LstData, setLstData] = useState([]);
//   const EV_spEventByTeacher_List = async () => {
//     const result = await fetchEventByTeacher({ UserId: parseInt(teacherId) });
//     console.log(result);
//     setLstData(result);
//   };

//   useEffect(() => {
//     EV_spEventByTeacher_List();
//   }, []);

//   // Hàm để chuyển đổi
//   const transformEvents = (event: any) => {
//     // Chuyển đổi StartTime và EndTime từ định dạng dd/MM/yyyy HH:mm:ss thành các tham số cho new Date()

//     // Tách ngày giờ của StartTime
//     const [startDate, startTime] = event.StartTime.split(" ");
//     const [startDay, startMonth, startYear] = startDate.split("/");
//     const [startHour, startMinute] = startTime.split(":");

//     // Tách ngày giờ của EndTime
//     const [endDate, endTime] = event.EndTime.split(" ");
//     const [endDay, endMonth, endYear] = endDate.split("/");
//     const [endHour, endMinute] = endTime.split(":");

//     return {
//       title: event.EventName,
//       allDay: false,
//       // Chuyển StartTime thành đối tượng Date
//       start: new Date(
//         parseInt(startYear), // Năm
//         parseInt(startMonth) - 1, // Tháng (lưu ý tháng bắt đầu từ 0)
//         parseInt(startDay), // Ngày
//         parseInt(startHour), // Giờ
//         parseInt(startMinute) // Phút
//       ),
//       // Chuyển EndTime thành đối tượng Date
//       end: new Date(
//         parseInt(endYear),
//         parseInt(endMonth) - 1,
//         parseInt(endDay),
//         parseInt(endHour),
//         parseInt(endMinute)
//       ),
//     };
//   };

//   const transformedEvents = LstData?.map(transformEvents);

//   console.log(transformedEvents);
//   const handleOnChangeView = (selectedView: View) => {
//     setView(selectedView);
//   };

//   return (
//     <Calendar
//       localizer={localizer}
//       events={transformedEvents}
//       startAccessor="start"
//       endAccessor="end"
//       views={["week", "day"]}
//       view={view}
//       style={{ height: "98%" }}
//       onView={handleOnChangeView}
//       min={new Date(2025, 1, 0, 0, 0, 0)}
//       max={new Date(2025, 1, 0, 24, 0, 0)}
//       culture="vn"
//     />
//   );
// };

// export default BigCalendar;

"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import "moment/locale/vi";
import { fetchEventByTeacher } from "@/app/action/event";
moment.locale("vi");
const localizer = momentLocalizer(moment);

const transformApiData = (event) => {
  const [startDate, startTime] = event.StartTime.split(" ");
  const [startDay, startMonth, startYear] = startDate.split("/");
  const [startHour, startMinute] = startTime.split(":");

  const [endDate, endTime] = event.EndTime.split(" ");
  const [endDay, endMonth, endYear] = endDate.split("/");
  const [endHour, endMinute] = endTime.split(":");

  return {
    title: event.EventName,
    allDay: false, // Hoặc true nếu sự kiện diễn ra cả ngày
    start: new Date(
      parseInt(startYear),
      parseInt(startMonth) - 1,
      parseInt(startDay),
      parseInt(startHour),
      parseInt(startMinute)
    ),
    end: new Date(
      parseInt(endYear),
      parseInt(endMonth) - 1,
      parseInt(endDay),
      parseInt(endHour),
      parseInt(endMinute)
    ),
  };
};

const BigCalendar = ({ teacherId }: { teacherId: number }) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [LstData, setLstData] = useState([]);


  const EV_spEventByTeacher_List = async () => {
    const result = await fetchEventByTeacher({ UserId: teacherId });
    // Giả sử result là dữ liệu bạn nhận được từ API
    console.log(result)
    const transformedEvents = result.map(transformApiData);
    setLstData(transformedEvents);
  };

  useEffect(() => {
    EV_spEventByTeacher_List();
  }, []);
  
  const sampleEvents = [
    {
      title: "Họp nhóm dự án",
      allDay: false,
      start: new Date(2024, 9, 10, 9, 0, 0), // 10/10/2024 09:00:00
      end: new Date(2024, 9, 10, 10, 0, 0),   // 10/10/2024 10:00:00
    },
    {
      title: "Lớp học trực tuyến",
      allDay: false,
      start: new Date(2024, 9, 24, 14, 0, 0), // 11/10/2024 14:00:00
      end: new Date(2024, 9, 24, 15, 30, 0),  // 11/10/2024 15:30:00
    },
    {
      title: "Cuộc họp với khách hàng",
      allDay: false,
      start: new Date(2024, 9, 26, 11, 0, 0), // 12/10/2024 11:00:00
      end: new Date(2024, 9, 26, 12, 0, 0),   // 12/10/2024 12:00:00
    },
    {
      title: "Buổi tập huấn",
      allDay: false,
      start: new Date(2024, 9, 13, 13, 0, 0), // 13/10/2024 13:00:00
      end: new Date(2024, 9, 13, 14, 30, 0),  // 13/10/2024 14:30:00
    },
    {
      title: "Duyệt dự án",
      allDay: false,
      start: new Date(2024, 9, 14, 15, 0, 0), // 14/10/2024 15:00:00
      end: new Date(2024, 9, 14, 16, 0, 0),   // 14/10/2024 16:00:00
    },
  ];

  console.log(sampleEvents)
  const fakeData = [
    {
      StartTime: "21/10/2024 14:00:00",
      EndTime: "22/10/2024 15:00:00",
      EventDescription: "<p>Sự kiện kéo dài hai ngày</p>",
      EventName: "Hội thảo công nghệ",
      EventTypeName: "Sinh hoạt công dân",
      LocationName: "Hội trường 1",
    },
    {
      StartTime: "23/10/2024 09:00:00",
      EndTime: "23/10/2024 17:00:00",
      EventDescription: "<p>Cuộc họp hàng tháng</p>",
      EventName: "Cuộc họp nhóm",
      EventTypeName: "Họp",
      LocationName: "Phòng họp 2",
    },
    {
      StartTime: "24/10/2024 08:00:00",
      EndTime: "25/10/2024 20:00:00",
      EventDescription: "<p>Sự kiện đặc biệt</p>",
      EventName: "Lễ hội mùa thu",
      EventTypeName: "Lễ hội",
      LocationName: "Công viên trung tâm",
    },
  ];
  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };
  
  return (
    <Calendar
      localizer={localizer}
      events={LstData}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      min={new Date(2024, 1, 0, 8, 0, 0)}
      max={new Date(2024, 1, 0, 17, 0, 0)}
    />
  );
};

export default BigCalendar;
