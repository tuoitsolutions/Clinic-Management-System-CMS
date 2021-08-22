import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Input,
} from "@material-ui/core";
import { useField } from "formik";
import React, { memo, FC } from "react";
import VisibilityOffRoundedIcon from "@material-ui/icons/VisibilityOffRounded";
import VisibilityRoundedIcon from "@material-ui/icons/VisibilityRounded";
import VpnKeyRoundedIcon from "@material-ui/icons/VpnKeyRounded";
import { useFormikContext } from "formik";

interface IFieldPassword {
  showPassword: boolean;
  handleTogglePassword: () => void;
}

export const FieldPassword: FC<IFieldPassword> = memo(
  ({ showPassword, handleTogglePassword }) => {
    const [field, meta, helpers] = useField({ name: "password" });
    return (
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="outlined-adornment-amount">Password</InputLabel>
        <Input
          type={showPassword ? "text" : "password"}
          id="outlined-adornment-amount"
          startAdornment={
            <InputAdornment position="start">
              <VpnKeyRoundedIcon fontSize="small" />
            </InputAdornment>
          }
          autoComplete="off"
          endAdornment={
            <div>
              {showPassword ? (
                <IconButton
                  size="small"
                  onClick={handleTogglePassword}
                  color="primary"
                >
                  <VisibilityRoundedIcon fontSize="small" />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  onClick={handleTogglePassword}
                  color="primary"
                >
                  <VisibilityOffRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          }
          onChange={(e) => {
            helpers.setValue(e.target.value);
          }}
          onBlur={(e) => {
            helpers.setValue(e.target.value);
          }}
          value={field.value}
          placeholder="Enter your password here"
        />
      </FormControl>
    );
  }
);

export default FieldPassword;
