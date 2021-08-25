import { TextField, TextFieldProps } from "@material-ui/core";
import React, { FC, memo } from "react";
import { Controller, useFormContext } from "react-hook-form";

export const TextFieldHookForm: FC<TextFieldProps> = memo((props) => {
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
      defaultValue={props.defaultValue}
      render={(ctrlProps, { invalid, isTouched, isDirty }) => (
        <TextField
          {...props}
          {...ctrlProps}
          autoComplete="off"
          value={!!ctrlProps.value ? ctrlProps.value : ""}
          error={error}
          helperText={error_message}
          onKeyPress={(event) => {
            if (props.type === "text") {
              if (!/^[A-Za-z ]+$/.test(event.key)) {
                event.preventDefault();
              }
            }

            if (props.type === "numberonly") {
              if (!/^[0-9]+$/.test(event.key)) {
                event.preventDefault();
              }
            }

            if (props.type === "decimal") {
              if (!/^[0-9.]+$/.test(event.key)) {
                event.preventDefault();
              }
            }
          }}
        />
      )}
    />
  );
});

export default TextFieldHookForm;
