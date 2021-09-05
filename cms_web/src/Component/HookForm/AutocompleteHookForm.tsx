import { TextField, TextFieldProps } from "@material-ui/core";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import React, { FC, memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import AutoCompleteLoader from "../../Assets/loaders/AutoCompleteLoader";
import clsx from "clsx";
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

    // useEffect(() => {

    //   return () => {

    //   }
    // }, [watch_field])

    if (!options) {
      return (
        <Autocomplete
          options={[]}
          disabled={true}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                disabled={true}
                placeholder={placeholder}
                InputLabelProps={InputLabelProps}
                label={label}
                multiline={multiline}
                rows={rows}
                size={size}
                variant={!!inputVariant ? inputVariant : "standard"}
                required={required}
              />
            );
          }}
        />
      );
    }

    return (
      <AutocompleteFieldUi>
        <div
          className={clsx("loader", {
            hide: !loading,
          })}
        >
          <AutoCompleteLoader
            disabled={disabled}
            label={label}
            InputLabelProps={{
              shrink: true,
            }}
            required={required}
            variant={inputVariant}
          />
        </div>
        <div
          className={clsx("field", {
            hide: loading,
          })}
        >
          <Controller
            name={name}
            control={control}
            onChange={([, data]) => data}
            defaultValue={!!defaultValue ? defaultValue : ""}
            render={({ onChange, ...props }) => (
              <Autocomplete
                options={
                  !!options
                    ? options
                    : [
                        {
                          id: "2",
                          label: "Honelyn Tuazon",
                        },
                      ]
                }
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
                // {...props}
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
                      variant={!!inputVariant ? inputVariant : "standard"}
                      error={error}
                      helperText={error_message}
                      required={required}
                      autoComplete="off"
                    />
                  );
                }}
              />
            )}
          />
        </div>
      </AutocompleteFieldUi>
    );
  }
);

export default AutocompleteHookForm;

const AutocompleteFieldUi = styled.div`
  display: grid;
  grid-template-areas: "f";

  .loader {
    max-width: 100%;
    grid-area: f;
  }
  .field {
    max-width: 100%;
    grid-area: f;
  }

  .hide {
    opacity: 0;
  }
`;
