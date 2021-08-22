import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from "@material-ui/core";
import React, { FC, memo } from "react";
import { Controller, useFormContext } from "react-hook-form";

export interface CheckItemsProps {
  label: string;
  id: string | number;
  disabled?: boolean;
  defaultCheck?: boolean;
}

interface MultCheckboxHookFormProps {
  name: string;
  label: string;
  variant?: "standard" | "outlined" | "filled";
  row?: boolean;
  radio_items: Array<CheckItemsProps>;
  required?: boolean;
}

const MultCheckboxHookForm: FC<MultCheckboxHookFormProps> = memo(
  (master_props) => {
    const { control, errors, trigger, setValue, register, getValues } =
      useFormContext();

    let error = false;
    let error_message = "";

    if (errors && errors?.hasOwnProperty(master_props?.name)) {
      error = true;
      error_message = errors[master_props?.name]?.message;
    }

    return (
      <FormControl
        // name={master_props.name}
        error={error}
        variant={master_props.variant}
        component="fieldset"
        {...register(master_props.name)}
        required={master_props.required}
      >
        <FormLabel
          component="legend"
          style={{
            transform: `translate(-10px, -6px) scale(0.75)`,
          }}
        >
          {master_props.label}
        </FormLabel>
        <FormGroup row={master_props.row}>
          {master_props.radio_items.map((field, index) => {
            return (
              <FormControlLabel
                key={master_props.name + `.${index}`}
                label={field.label}
                control={
                  <Controller
                    name={master_props.name + `.${index}`}
                    control={control}
                    render={(props) => {
                      const checkbox_values = getValues(master_props.name);

                      let checked = false;

                      if (!!checkbox_values) {
                        const find_field = checkbox_values.find(
                          (f) => f == field.id
                        );

                        if (!!find_field) {
                          checked = true;
                        }
                      }

                      return (
                        <Checkbox
                          {...props}
                          checked={checked}
                          size="small"
                          value={field.id}
                          onChange={(e) => {
                            if (!!checkbox_values) {
                              if (checkbox_values instanceof Array) {
                                const found_def = checkbox_values.findIndex(
                                  (cv) => cv == field.id
                                );

                                setValue(
                                  master_props.name + `.${found_def}`,
                                  "",
                                  {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  }
                                );
                              }
                            }

                            props.onChange(e.target.checked ? field.id : false);
                            trigger(master_props.name);
                          }}
                        />
                      );
                    }}
                  />
                }
              />
            );
          })}
        </FormGroup>
        <FormHelperText>{error_message}</FormHelperText>
      </FormControl>
    );
  }
);

export default MultCheckboxHookForm;
