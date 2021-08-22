import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import React, { FC, memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
export interface RadioItemProps {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface MultiRadioFieldHookFormProps {
  name: string;
  label: string;
  variant?: "standard" | "outlined" | "filled";
  row?: boolean;
  radio_items: Array<RadioItemProps>;
  required?: boolean;
  size?: "small" | "medium";
}

export const MultiRadioFieldHookForm: FC<MultiRadioFieldHookFormProps> = memo(
  (props) => {
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
        render={(ctrlProps) => (
          <StyledRadioGroup
            error={error}
            variant={props.variant}
            // component="fieldset"
            required={props.required}
            size={props.size}
          >
            <FormLabel
              component="legend"
              style={{
                transform: `translate(-22px, -8px) scale(0.75)`,
              }}
            >
              {props.label}
            </FormLabel>
            <RadioGroup
              row={props.row}
              {...ctrlProps}
              value={!!ctrlProps.value ? ctrlProps.value.toString() : ""}
            >
              {props.radio_items.map((radio, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    value={radio.value.toString()}
                    control={<Radio size={props.size} />}
                    label={radio.label}
                    disabled={radio.disabled}
                  />
                );
              })}
            </RadioGroup>
            <FormHelperText>{error_message}</FormHelperText>
          </StyledRadioGroup>
        )}
      />
    );
  }
);

export default MultiRadioFieldHookForm;

const StyledRadioGroup = styled(FormControl)`
  .MuiFormLabel-root {
    transform: translate(-22px, -1px) scale(0.75) !important;
  }
  .MuiButtonBase-root {
    padding: 7px;
    margin: 0;
  }
`;
