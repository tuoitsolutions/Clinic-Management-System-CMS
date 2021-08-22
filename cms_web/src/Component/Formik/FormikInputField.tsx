import { TextField, TextFieldProps } from "@material-ui/core";
import { FastField, useField } from "formik";
import React from "react";

interface CustomTextFieldProps {
  fastfield?: boolean;
}

const FormikInputField: React.FC<CustomTextFieldProps & TextFieldProps> = ({
  fastfield,
  ...props
}) => {
  const [field, meta, helpers] = useField(
    typeof props.name !== "undefined" ? props.name : ""
  );
  if (fastfield === true) {
    return (
      <FastField name={props.name}>
        {({ field, meta }) => {
          const errorText = meta.error && meta.touched ? meta.error : "";
          return (
            <TextField
              {...props}
              {...field}
              value={field.value ? field.value : ""}
              error={!!errorText}
              helperText={errorText}
            />
          );
        }}
      </FastField>
    );
  } else {
    const errorText = meta.error && meta.touched ? meta.error : "";

    return (
      <TextField
        {...props}
        {...field}
        value={field.value ? field.value : ""}
        error={!!errorText}
        helperText={errorText}
      />
    );
  }
};

export default FormikInputField;
