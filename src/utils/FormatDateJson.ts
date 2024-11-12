import moment from "moment";

export const FormatDateJsonPro = (date : any, type = 0) => {
  if (date === "" || date === "1900-01-01T00:00:00") return "";
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    dayNumber = "" + d.getUTCDay(),
    year = d.getFullYear(),
    h = d.getHours(),
    m = d.getMinutes(),
    s = d.getSeconds();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (month.toString().length < 2) month = "0" + month;
  if (day.toString().length < 2) day = "0" + day;
  if (h.toString().length < 2) h = "0" + h;
  if (m.toString().length < 2) m = "0" + m;

  if (s.toString().length < 2) s = "0" + s;

  if (date === undefined) return "";

  if (type === 0) {
    return [month, day, year].join("/") + " " + [h, m, s].join(":");
  }
  if (type === 1) {
    return [month, day, year].join("/") + " 00:00:00";
  }
  if (type === 2) {
    return [month, day, year].join("/") + " 23:59:59";
  }
  if (type === 3) {
    return [month, day, year].join("/");
  }
  if (type === 4) return [year, month, day].join("-");

  if (type === 6) return { year: year, month: month };

  if (type === 7) return [day, month, year].join("/");

  if (type === 8) return [month, year].join("-");

  if (type === 9) return [year, month].join("-");

  if (type === 5) return [h, m].join(":") + " " + [day, month, year].join("/");

  if (type === 10) {
    return [day, month, year].join("/") + " " + [h, m, s].join(":");
  }
  if (type === 11) {
    return [day, month].join("/");
  }
  if (type === 12) {
    return ["Ngày", day, "tháng", month, "năm", year].join(" ");
  }
  if (type === 13) {
    return [year, month, day, h, m, s].join("");
  }
  if (type === 14) {
    return [day, "/", month].join("");
  }
  if (type === 15) return [year, month, day].join("-") + " " + [h, m].join(":");

  if (type === 16) return [year, month, day].join("-");

  if (type === 17) return [h, m].join(":");
  if (type === 18)
    return (
      [day, month, year.toString().substring(2)].join("") +
      "" +
      [h, m, s].join("")
    );
  if (type === 19) {
    return (
      [day, month, year.toString().substring(2)].join("/") +
      " " +
      [h, m].join(":")
    );
  }
  if (type === 20) {
    let d1 = new Date(),
      month1 = "" + (d1.getMonth() + 1),
      day1 = "" + d1.getDate(),
      year1 = d1.getFullYear(),
      h1 = d1.getHours(),
      m1 = d1.getMinutes();

    if (month1.toString().length < 2) month1 = "0" + month1;
    if (day1.toString().length < 2) day1 = "0" + day1;
    if (h1.toString().length < 2) h1 = "0" + h1;
    if (m1.toString().length < 2) m1 = "0" + m1;

    return [year1, month1, day1].join("-") + " " + [h1, m1].join(":");
  }
  if (type === 21) return moment(date).format("YYYY-MM-DD HH:mm:ss");
  if (type === 22) return moment(date).format("YYYY-MM-DD");
  if (type === 23) return moment(date).format("YYYY-MM-DD HH:mm");
};
