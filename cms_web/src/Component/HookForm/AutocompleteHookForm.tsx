import { TextField, TextFieldProps } from "@material-ui/core";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import React, { FC, memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import AutoCompleteLoader from "../../Assets/loaders/AutoCompleteLoader";
interface IAutocompleteHookForm {
  label?: string;
  name: string;
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
  options?: any;
  onChangeCallback?: (val: any) => void;
  //to be removed
  defaultInputValue?: any;
  loading?: boolean;
}

const AutocompleteHookForm: FC<TextFieldProps & IAutocompleteHookForm> = memo(
  ({
    label,
    rows,
    multiline,
    variant,
    required,
    placeholder,
    disabled,
    name,
    defaultValue,
    size,
    options,
    InputLabelProps,
    onChangeCallback,
    loading,
  }) => {
    const inputVariant: any = variant;
    const { control, errors } = useFormContext();

    let error = false;
    let error_message = "";

    if (errors && errors?.hasOwnProperty(name)) {
      error = true;
      error_message = errors[name]?.message;
    }

    const getOpObj = (option) => {
      if (!option.id) option = options.find((op) => op.id == option);
      return option;
    };

    const filterOptions = createFilterOptions({
      trim: true,
      ignoreCase: true,
    });

    // const filterOptions = (options: any, { inputValue }) =>
    //   matchSorter(options, inputValue, {
    //     keys: [(item) => item?.label?.replace(/ /g, " ")],
    //   });

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
      <Controller
        name={name}
        control={control}
        onChange={([, data]) => data}
        defaultValue={!!defaultValue ? defaultValue : ""}
        render={({ onChange, ...props }) => (
          <Autocomplete
            options={options}
            getOptionLabel={(option) => {
              const opt = getOpObj(option);
              return !!opt?.label ? opt?.label : "";
            }}
            getOptionSelected={(option, value) => {
              const opt = getOpObj(value);
              if (!!opt?.id) {
                return option.id == opt?.id;
              } else {
                return false;
              }
            }}
            value={!!props.value ? props.value : ""}
            disabled={disabled}
            filterOptions={filterOptions}
            onChange={(e, data) => {
              const val = !!data?.id ? data.id : "";
              if (typeof onChangeCallback === "function") {
                onChangeCallback(!!val ? val : "");
              }
              if (!!val) {
                return onChange(!!val ? val : "");
              } else {
                return onChange("");
              }
            }}
            {...props}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  disabled={disabled}
                  // defaultValue={props.value}
                  placeholder={placeholder}
                  InputLabelProps={InputLabelProps}
                  label={label}
                  multiline={multiline}
                  rows={rows}
                  size={size}
                  variant={!!inputVariant ? inputVariant : "standard"}
                  error={error}
                  helperText={error_message}
                  required={required}
                />
              );
            }}
          />
        )}
      />
    );
  }
);

export default AutocompleteHookForm;
