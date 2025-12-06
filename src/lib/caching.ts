const daysOfTheWeekShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthShort = [
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

export function dateToLastModified(date: Date): string {
  // Transform date timezone from any to GMT (Greenwich Mean Time)
  date = new Date(
    Intl.DateTimeFormat("en-US", { timeZone: "Europe/London" }).format(date),
  );

  // Last-Modified: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT
  // Example: Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
  let lastModified = "";

  const dayOfTheWeek = daysOfTheWeekShort[date.getDay()];

  lastModified += dayOfTheWeek + ", ";

  const day = date.getDate();
  const dayStr = day < 10 ? "0" + day.toString() : day.toString();
  lastModified += dayStr + " ";

  const month = monthShort[date.getMonth()];
  lastModified += month + " ";

  const year = date.getFullYear().toString();
  lastModified += year + " ";

  const hours =
    date.getHours() < 10
      ? "0" + date.getHours().toString()
      : date.getHours().toString();
  lastModified += hours + ":";

  const minutes =
    date.getMinutes() < 10
      ? "0" + date.getMinutes().toString()
      : date.getMinutes().toString();
  lastModified += minutes + ":";

  const seconds =
    date.getSeconds() < 10
      ? "0" + date.getSeconds().toString()
      : date.getSeconds().toString();
  lastModified += seconds + " ";
  lastModified += "GMT";

  return lastModified;
}
