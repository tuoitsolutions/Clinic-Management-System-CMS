import { TextField, TextFieldProps } from "@material-ui/core";
import React, { FC, memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import NumberFormat from "react-number-format";

export const NumberHookForm: FC<TextFieldProps> = memo((props: any) => {
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
        <NumberFormat
          // {...props}
          {...props}
          {...ctrlProps}
          value={!!ctrlProps.value ? ctrlProps.value : ""}
          error={error}
          helperText={error_message}
          required={props.required}
          placeholder={props.placeholder}
          label={props.label}
          variant={props.variant}
          InputLabelProps={props.InputLabelProps}
          fullWidth={props.fullWidth}
          decimalScale={2}
          allowNegative={false}
          thousandSeparator={","}
          customInput={TextField}
        />
      )}
    />
  );
});

export default NumberHookForm;
