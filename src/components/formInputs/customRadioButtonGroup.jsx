import { useFormContext, Controller } from "react-hook-form";
// import { styled } from "@mui/material/styles";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";

const CustomRadioButtonGroup = ({
  name,
  label,
  children,
  disabled,
  onClickHandler,
  ...otherProps
}) => {
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
          <FormControl disabled={disabled}>
            <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
            <RadioGroup
              aria-labelledby="employee_type_label"
              onClick={(val) => field.onClick(onClickHandler(val.target.value))}
              {...field}
              {...otherProps}
              name={name}
              row
            >
              {children}
            </RadioGroup>
            <FormHelperText sx={{ color: "red" }}>
              {errors[name] ? errors[name]?.message : ""}
            </FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default CustomRadioButtonGroup;
