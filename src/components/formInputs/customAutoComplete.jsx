import { useFormContext, Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const CustomAutoComplete = ({
  name,
  options,
  label,
  placeholder,
  onClick,
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
          <Autocomplete
            {...otherProps}
            options={options}
            disableCloseOnSelect
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={!!errors[name]}
                helperText={errors[name] ? errors[name]?.message : ""}
              />
            )}
            onChange={(_, data) => field.onChange(data)}
            isOptionEqualToValue={(option, value) => {
              return option?.id == value?.id;
            }}
          />
        );
      }}
    />
  );
};

export default CustomAutoComplete;
