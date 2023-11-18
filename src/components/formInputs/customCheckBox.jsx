import { useFormContext, Controller } from "react-hook-form";
import styled from "@emotion/styled";
import CheckBox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";

const CheckBoxLable = styled("span")(({ theme }) => ({
  fontSize: "12px",
}));

const CustomCheckBox = ({ name, label, children, ...otherProps }) => {
  // ? Utilizing useFormContext to have access to the form Context
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormControlLabel
            label={<CheckBoxLable>{label}</CheckBoxLable>}
            control={
              <CheckBox
                aria-labelledby="checkbox-label"
                {...field}
                {...otherProps}
                name={name}
              />
            }
          >
            <FormHelperText sx={{ color: "red" }}>
              {errors[name] ? errors[name]?.message : ""}
            </FormHelperText>
          </FormControlLabel>
        );
      }}
    />
  );
};

export default CustomCheckBox;
