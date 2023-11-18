import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";

const TextSearchInput = ({
  name,
  label,
  handleSubmit,
  isLoading,
  isFetching,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    // Allow only numeric characters
    if (
      !/^\d$/.test(e.key) && // Check if the key is not a number
      !e.ctrlKey && // Allow Ctrl + A, Ctrl + C, etc.
      !e.metaKey && // Allow Cmd + A, Cmd + C, etc. (for Mac)
      e.key !== "Backspace" && // Allow Backspace key
      e.key !== "Delete" // Allow Delete key
    ) {
      e.preventDefault(); // Prevent the default behavior (don't allow the key to be typed)
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControl variant="outlined" size="small">
          <InputLabel htmlFor={name}>{label}</InputLabel>
          <OutlinedInput
            {...field}
            {...props}
            value={field.value || ""}
            onKeyDown={handleKeyDown}
            endAdornment={
              isLoading ? (
                <InputAdornment position="end">
                  <IconButton disabled aria-label="loading" edge="end">
                    <CircularProgress size={20} aria-busy={isLoading} />
                  </IconButton>
                </InputAdornment>
              ) : (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="search"
                    edge="end"
                    onClick={handleSubmit}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }
            label={label}
            error={!!errors[name]}
          />
          <FormHelperText sx={{ color: "red" }}>
            {errors[name] ? errors[name]?.message : ""}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default TextSearchInput;
