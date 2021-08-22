import { MenuItem, TextField, TextFieldProps } from "@material-ui/core";
import React, { FC, memo } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface OptionItemProps {
  title: string;
  value: string;
}

interface SelectFieldHookFormProps {
  options: Array<OptionItemProps>;
}

export const SelectFieldHookForm: FC<
  TextFieldProps & SelectFieldHookFormProps
> = memo((props) => {
  const { control, errors } = useFormContext();

  let error = false;
  let error_message = "";

  if (errors && errors?.hasOwnProperty(props?.name)) {
    error = true;
    error_message = errors[props?.name]?.message;
  }

  return (
    <Controller
      name={props.name}
      control={control}
      // defaultValue={""}
      render={(ctrlProps, { invalid, isTouched, isDirty }) => (
        <TextField
          {...props}
          {...ctrlProps}
          value={ctrlProps.value ? ctrlProps.value : ""}
          error={error}
          helperText={error_message}
          select
        >
          <MenuItem value={""}>
            <small>
              <em>None</em>
            </small>
          </MenuItem>
          {props.options.map((o, i) => (
            <MenuItem key={i} value={o.value}>
              {o.title}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
});

export default SelectFieldHookForm;
