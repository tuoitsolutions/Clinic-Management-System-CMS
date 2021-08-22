import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { useField } from "formik";
import React, { memo, FC } from "react";
import PersonRoundedIcon from "@material-ui/icons/PersonRounded";
import { Input } from "@material-ui/core";
interface IFieldUsername {}

export const FieldUsername: FC<IFieldUsername> = memo(() => {
  const [field, meta, helpers] = useField({ name: "username" });
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor="outlined-adornment-amount">Username</InputLabel>
      <Input
        id="outlined-adornment-amount"
        autoComplete={"off"}
        startAdornment={
          <InputAdornment position="start">
            <PersonRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        autoFocus={true}
        type="text"
        onChange={(e) => {
          helpers.setValue(e.target.value);
        }}
        onBlur={(e) => {
          helpers.setValue(e.target.value);
        }}
        value={field.value}
        placeholder="Enter your username here"
      />
    </FormControl>
  );
});

export default FieldUsername;
