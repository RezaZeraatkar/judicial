import { useFormContext, Controller } from "react-hook-form";
// import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";

const CustomSelect = ({ name, children, ...otherProps }) => {
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
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="demo-simple-select-disabled-label">
              {otherProps["label"]}
            </InputLabel>
            <Select
              value={field.value || ""}
              {...field}
              {...otherProps}
              error={!!errors[name]}
            >
              {children}
            </Select>
            <FormHelperText sx={{ color: "red" }}>
              {errors[name] ? errors[name]?.message : ""}
            </FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default CustomSelect;
