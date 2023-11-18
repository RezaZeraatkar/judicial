import moment from "moment/moment";

export default function formValuesFormatHandler(values, key) {
  // handling date format for db usage
  const vals = {
    ...values,
    [`${key}`]: moment(values[`${key}`], "YYYY-MM-DD")
      .locale("fa")
      .format("YYYY-MM-DD"),
  };
  return vals;
}
