import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";

export default function CustomSearchInput({
  isLoading,
  handleSubmit,
  width,
  renderSearchResult,
  setTableShow,
  name,
  ...props
}) {
  const [value, setValue] = useState("");
  function handleChange(e) {
    // const regex = "^[0-9]*$";
    // if (e.target.value.match(regex))
    if (e.target.value.length <= 0) {
      setTableShow(false);
    }
    setValue(e.target.value);
  }

  function onClickHandler(e) {
    if ((e.key === "Enter" || e.button === 0) && value) handleSubmit(value);
  }

  return (
    <FormControl sx={{ m: 1 }} variant="outlined" size="small">
      <InputLabel htmlFor={props.id}>جستجو کدملی یا نام‌خانوداگی...</InputLabel>
      <OutlinedInput
        id={props.id}
        value={value}
        name={name}
        sx={{ backgroundColor: "white" }}
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
                onClick={onClickHandler}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }
        label="search"
        onChange={handleChange}
        onKeyDown={onClickHandler}
        {...props}
      />
      <FormHelperText id="component-helper-text" sx={{ color: "red" }}>
        {props.disabled && "برای فعال شدن جستجو نوع عضویت را انتخاب کنید!"}
      </FormHelperText>
      <Paper sx={{ zIndex: "1000", position: "relative" }}>
        {renderSearchResult}
      </Paper>
    </FormControl>
  );
}
