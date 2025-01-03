type RouteAccessMap = {
    [key: string]: string[];
  };
  
  export const routeAccessMap: RouteAccessMap = {
    "/admin(.*)": ["admin"],
    "/student(.*)": ["student","admin"],
    "/teacher(.*)": ["teacher"],
    "/parent(.*)": ["parent"],
    "/list/teachers": ["admin", "teacher"],
    "/list/students": ["admin", "teacher"],
    "/list/parents": ["admin", "teacher"],
    "/list/subjects": ["admin"],
    "/list/classes": ["admin", "teacher"],
    "/list/exams": ["admin", "teacher", "student"],
    "/list/assignments": ["admin", "teacher", "student"],
    "/list/results": ["admin", "teacher", "student"],
    "/list/attendance": ["admin", "teacher", "student"],
    "/list/events": ["admin", "teacher", "student"],
    "/list/announcements": ["admin", "teacher", "student"],
    "/myevent": ["student"],
    "/trainingpoint": ["student"],
    "/profile": ["student","teacher"],
  };