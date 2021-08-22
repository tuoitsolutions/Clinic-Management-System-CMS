import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { FC, memo } from "react";
import AutoCompleteLoader from "../Assets/loaders/AutoCompleteLoader";
import { OptionItemModel } from "../Services/Models/OptionModel";

interface IControlledAutocomplete {
  label?: string;
  className?: string;
  rows?: number;
  multiline?: boolean;
  required?: boolean;
  placeholder?: string;
  size?: "small" | "medium";
  optKeyIdType?: "string" | "number";
  disabled?: boolean;
  endpoint?: string;
  defaultValue?: string;
  onChangeCallback?: (val: any) => void;
  //to be removed
  defaultInputValue?: any;
  loading?: boolean;
  value?: OptionItemModel;
  InputLabelProps?: any;
  variant?: any;
  options: Array<OptionItemModel>;
}

const ControlledAutocomplete: FC<IControlledAutocomplete> = memo(
  ({
    label,
    rows,
    multiline,
    variant,
    required,
    placeholder,
    disabled,
    size,
    options,
    InputLabelProps,
    onChangeCallback,
    loading,
    value,
    ...props
  }) => {
    const inputVariant: any = variant;

    // const flatProps = {
    //   options: top100Films.map((option) => option.title),
    // };

    if (loading) {
      return (
        <AutoCompleteLoader
          disabled={disabled}
          label={label}
          InputLabelProps={{
            shrink: true,
          }}
          required
          variant={inputVariant}
        />
      );
    }

    return (
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option?.label?.toLowerCase()}
        value={value}
        onChange={(e, data: any) => {
          if (typeof onChangeCallback === "function") {
            onChangeCallback(data);
          }
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              disabled={disabled}
              placeholder={placeholder}
              InputLabelProps={InputLabelProps}
              label={label}
              multiline={multiline}
              rows={rows}
              size={size}
              required={required}
            />
          );
        }}
      />
    );
  }
);

export default ControlledAutocomplete;
