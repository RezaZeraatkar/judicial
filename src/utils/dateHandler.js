import moment from "jalali-moment";

export default function dateHandler(date, { format }) {
  if (format) {
    return date && moment(date).isValid()
      ? moment(date, "YYYY-MM-DD").locale("fa").format("YYYY/MM/DD")
      : "";
  } else {
    return date && moment(date).isValid() ? moment(date, "YYYY-MM-DD")._d : "";
  }
}
