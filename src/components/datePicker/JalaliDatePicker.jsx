import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import TextField from "@mui/material/TextField";

export default function JalaliDatePicker(props) {
  const { label } = props;
  const [value, setValue] = React.useState(moment());
  return (
    <DatePicker
      label={label}
      mask="____/__/__"
      value={value}
      onChange={(newValue) => setValue(newValue)}
      renderInput={(params) => <TextField {...params} />}
    />
  );
}
