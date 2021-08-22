import {
  FormControlLabel,
  FormControlLabelProps,
  Switch,
} from "@material-ui/core";
import { useField } from "formik";
import React from "react";

interface CustomTextFieldProps {
  fastfield?: boolean;
  name: string;
}

const FormikSwitchField: React.FC<CustomTextFieldProps> = ({
  fastfield,
  ...props
}) => {
  const [field, meta, helpers] = useField(
    typeof props.name !== "undefined" ? props.name : ""
  );

  return (
    <FormControlLabel
      control={
        <Switch
          checked={field.value}
          color="primary"
          size="small"
          onChange={() => {
            helpers.setValue(field.value ? false : true);
          }}
        />
      }
      label="Applicable"
    />
  );
};

export default FormikSwitchField;
