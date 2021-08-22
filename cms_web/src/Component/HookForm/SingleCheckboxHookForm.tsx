import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from "@material-ui/core";
import React, { FC, memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
interface RadioItems {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SingleCheckboxHookFormProps {
  //extends Partial<> {
  name: string;
  label: string;
  variant?: "standard" | "outlined" | "filled";
  size?: "small" | "medium";
}

export const SingleCheckboxHookForm: FC<SingleCheckboxHookFormProps> = memo(
  (props) => {
    const { control, errors, setValue } = useFormContext();

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
        render={(ctrlProps, { invalid, isTouched, isDirty }) => {
          return (
            <FormControl
              error={error}
              variant={props.variant}
              component="fieldset"
              size={props.size}
            >
              <StyledSingleCheckboxHookForm>
                <FormControlLabel
                  label={props.label}
                  value={true}
                  name={props.name}
                  control={
                    <Checkbox
                      name={props.name}
                      checked={
                        typeof ctrlProps.value !== "undefined" &&
                        ctrlProps.value !== false
                      }
                      size={props.size}
                      onChange={(e) => {
                        setValue(
                          props.name,
                          ctrlProps.value ? undefined : e.target.value,
                          {
                            shouldDirty: true,
                            shouldValidate: true,
                          }
                        );
                      }}
                    />
                  }
                />
              </StyledSingleCheckboxHookForm>

              <FormHelperText>{error_message}</FormHelperText>
            </FormControl>
          );
        }}
      />
    );
  }
);

export default SingleCheckboxHookForm;

const StyledSingleCheckboxHookForm = styled(FormGroup)`
  .MuiTypography-root.MuiFormControlLabel-label.MuiTypography-body1 {
    font-size: 0.8em;
    opacity: 0.8;
    padding: 0 0.7em;
  }
`;
