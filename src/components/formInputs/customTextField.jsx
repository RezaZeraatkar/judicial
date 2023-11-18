import { useFormContext, Controller } from "react-hook-form";
import styled from "@emotion/styled";
import TextField from "@mui/material/TextField";

const CustomNumberField = styled(TextField)(({ theme }) => ({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}));

const CustomTextField = ({
  name,
  defaultValue,
  helperText,
  value,
  ...otherProps
}) => {
  // Utilizing useFormContext to have access to the form Context
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      // defaultValue={defaultValue}
      render={({ field }) => (
        <CustomNumberField
          value={value}
          {...field}
          {...otherProps}
          error={!!errors[name]}
          helperText={
            errors[name] ? errors[name]?.message : helperText ? helperText : ""
          }
        />
      )}
    />
  );
};

export default CustomTextField;
