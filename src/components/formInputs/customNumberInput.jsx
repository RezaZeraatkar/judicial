import { useFormContext, Controller } from "react-hook-form";
import styled from "@emotion/styled";
import TextField from "@mui/material/TextField";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}));

const CustomNumberField = ({
  name,
  defaultValue,
  helperText,
  ...otherProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Define a custom validation function using Zod
  // const validateNationalCode = (input) => {
  //   const schema = z
  //     .string()
  //     .regex(/^\d{10}$/)
  //     .refine((value) => isValidIranianNationalCode(value), {
  //       message: "Invalid Iranian national code",
  //     });
  //   schema.parse(input);
  // };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <CustomTextField
          {...field}
          {...otherProps}
          error={!!errors[name]}
          helperText={
            errors[name] ? errors[name].message : helperText ? helperText : ""
          }
        />
      )}
    />
  );
};

export default CustomNumberField;
