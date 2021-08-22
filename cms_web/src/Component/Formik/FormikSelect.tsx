import { MenuItem, TextField, TextFieldProps } from "@material-ui/core";
import { FastField, useField } from "formik";
import React from "react";

interface IOptions {
  id: string | number;
  label: string | number;
}

interface IFormikSelect {
  data: Array<IOptions>;
  label: string;
  name: string;
  hasEmptyValue?: boolean;
  fastfield?: boolean;
}

export const FormikSelect: React.FC<IFormikSelect & TextFieldProps> = ({
  data,
  name,
  hasEmptyValue,
  fastfield,
  ...props
}) => {
  const [field, meta] = useField({ name });
  const errorText = meta.error && meta.touched ? meta.error : "";

  if (fastfield === true) {
    return (
      <FastField name={name}>
        {({ field, form, meta }) => {
          const errorText = meta.error && meta.touched ? meta.error : "";
          return (
            <TextField
              {...props}
              {...field}
              error={!!errorText}
              helperText={errorText}
              label={props.label}
              variant="outlined"
              SelectProps={{
                native: true,
              }}
              select
            >
              {hasEmptyValue === true && (
                <option value={""}>
                  <small>
                    <em>None</em>
                  </small>
                </option>
              )}

              {data.map((val, ind) => (
                <option key={ind} value={val.id}>
                  {val.label}
                </option>
              ))}
            </TextField>
          );
        }}
      </FastField>
    );
  } else {
    return (
      <TextField
        error={!!errorText}
        helperText={errorText}
        {...props}
        {...field}
        label={props.label}
        variant="outlined"
        SelectProps={{
          native: true,
        }}
        select
      >
        {hasEmptyValue === true && (
          <option value={""}>
            <small>
              <em>None</em>
            </small>
          </option>
        )}

        {data.map((val, ind) => (
          <option key={ind} value={val.id}>
            {val.label}
          </option>
        ))}
      </TextField>
    );
  }
};

export default FormikSelect;
