import { useFormContext, Controller } from "react-hook-form";
// import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";

const CustomDatePicker = ({ name, label, ...otherProps }) => {
  // ? Utilizing useFormContext to have access to the form Context
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field }) => {
        return (
          <DatePicker
            label={label}
            mask="____/__/__"
            {...field}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!errors[name]}
                helperText={errors[name] ? errors[name]?.message : ""}
              />
            )}
            {...otherProps}
          />
        );
      }}
    />
  );
};

export default CustomDatePicker;
