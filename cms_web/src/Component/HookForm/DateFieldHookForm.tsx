import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
  KeyboardDateTimePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import "date-fns";
import moment from "moment";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface DateFieldHookFormProps extends Partial<KeyboardDatePickerProps> {
  name: string;
  onChange?: any;
  type: "date" | "datetime" | "time" | "year" | "month";
  trigger_fields?: Array<string>;
  initialFocusedDate?: string;
}

const DateFieldHookForm: React.FC<DateFieldHookFormProps> = React.memo(
  (props) => {
    const { control, errors, trigger } = useFormContext();

    let error = false;
    let error_message = "";

    if (errors && errors?.hasOwnProperty(props?.name)) {
      error = true;
      error_message = errors[props?.name]?.message;
    }

    const today_date = moment().toISOString().split("T").shift();

    return (
      <Controller
        control={control}
        name={props.name}
        defaultValue={props.defaultValue}
        render={(ctrl_props) => {
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <>
                {props.type === "datetime" && (
                  <KeyboardDateTimePicker
                    name={props.name}
                    label={props.label}
                    fullWidth={true}
                    size={props.size}
                    disableFuture={props.disableFuture}
                    disablePast={props.disablePast}
                    clearable={props.clearable}
                    InputLabelProps={props.InputLabelProps}
                    inputVariant={props.inputVariant}
                    value={!!ctrl_props.value ? ctrl_props.value : null}
                    onChange={ctrl_props.onChange}
                    onBlur={ctrl_props.onBlur}
                    format="yyyy/MM/dd hh:mm a"
                    autoOk={true}
                    error={error}
                    helperText={error_message}
                    required={props.required}
                    disabled={props.disabled}
                    readOnly={props.readOnly}
                    autoComplete="off"
                  />
                )}

                {props.type === "date" && (
                  <KeyboardDatePicker
                    name={ctrl_props.name}
                    label={props.label}
                    fullWidth={true}
                    size={props.size}
                    disableFuture={props.disableFuture}
                    disablePast={props.disablePast}
                    clearable={props.clearable}
                    InputLabelProps={props.InputLabelProps}
                    inputVariant={props.inputVariant}
                    format={!!props.format ? props.format : "MM/dd/yyyy"}
                    autoOk={true}
                    error={!!props.error ? props.error : error}
                    helperText={
                      !!props.helperText ? props.helperText : error_message
                    }
                    mask={props.mask}
                    placeholder={"MM/DD/YYYY"}
                    required={props.required}
                    disabled={props.disabled}
                    readOnly={props.readOnly}
                    autoComplete="off"
                    onBlur={ctrl_props.onBlur}
                    value={!!ctrl_props.value ? ctrl_props.value : null}
                    onChange={(date: Date, value: string) => {
                      ctrl_props.onChange(date, value);

                      if (!!props.trigger_fields) {
                        if (props.trigger_fields instanceof Array) {
                          props.trigger_fields.forEach((f) => {
                            trigger(f);
                          });
                        }
                      }
                    }}
                  />
                )}

                {props.type === "year" && (
                  <KeyboardDatePicker
                    name={props.name}
                    views={["year"]}
                    label={props.label}
                    fullWidth={true}
                    size={props.size}
                    disableFuture={props.disableFuture}
                    disablePast={props.disablePast}
                    clearable={props.clearable}
                    InputLabelProps={props.InputLabelProps}
                    inputVariant={props.inputVariant}
                    onChange={ctrl_props.onChange}
                    onBlur={ctrl_props.onBlur}
                    value={!!ctrl_props.value ? ctrl_props.value : null}
                    // value={value ? moment(value).format() : ""}
                    format={!!props.format ? props.format : "yyyy"}
                    autoOk={true}
                    error={error}
                    helperText={error_message}
                    placeholder={
                      !!props.placeholder ? props.placeholder : "yyyy"
                    }
                    required={props.required}
                    disabled={props.disabled}
                    readOnly={props.readOnly}
                    autoComplete="off"
                  />
                )}

                {props.type === "month" && (
                  <KeyboardDatePicker
                    name={props.name}
                    views={["month"]}
                    label={props.label}
                    fullWidth={true}
                    size={props.size}
                    disableFuture={props.disableFuture}
                    disablePast={props.disablePast}
                    clearable={props.clearable}
                    InputLabelProps={props.InputLabelProps}
                    inputVariant={props.inputVariant}
                    onChange={ctrl_props.onChange}
                    onBlur={ctrl_props.onBlur}
                    value={!!ctrl_props.value ? ctrl_props.value : null}
                    // value={value ? moment(value).format() : ""}
                    format="MM"
                    autoOk={true}
                    error={error}
                    helperText={error_message}
                    placeholder="MM"
                    required={props.required}
                    disabled={props.disabled}
                    readOnly={props.readOnly}
                    autoComplete="off"
                  />
                )}

                {props.type === "time" && (
                  <KeyboardTimePicker
                    name={ctrl_props.name}
                    label={props.label}
                    fullWidth={true}
                    size={props.size}
                    InputLabelProps={props.InputLabelProps}
                    inputVariant={props.inputVariant}
                    onChange={(date: Date, value: string) => {
                      ctrl_props.onChange(date, value);

                      if (!!props.trigger_fields) {
                        if (props.trigger_fields instanceof Array) {
                          props.trigger_fields.forEach((f) => {
                            trigger(f);
                          });
                        }
                      }
                    }}
                    // onBlur={ctrl_props.onBlur}
                    value={!!ctrl_props.value ? ctrl_props.value : null}
                    placeholder="__:__ _M"
                    mask="__:__ _M"
                    initialFocusedDate={
                      !!props.initialFocusedDate
                        ? moment(`${today_date} ${props.initialFocusedDate}`)
                        : null
                    }
                    error={error}
                    helperText={error_message}
                    required={props.required}
                    disabled={props.disabled}
                    readOnly={props.readOnly}
                    autoComplete="off"
                  />
                )}
              </>
            </MuiPickersUtilsProvider>
          );
        }}
      />
    );
  }
);

export default DateFieldHookForm;
