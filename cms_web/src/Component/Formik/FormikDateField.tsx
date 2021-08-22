import DateFnsUtils from "@date-io/date-fns";
import { Grid } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
  TimePicker,
} from "@material-ui/pickers";
import "date-fns";
import { useField } from "formik";
import moment from "moment";
import React from "react";

interface IFormikDateField {
  name: string;
  label?: string;
  disableFuture?: boolean;
  disablePast?: boolean;
  variant?: "outlined" | "standard" | "filled";
  clearable?: boolean;
  showTodayButton?: boolean;
  size?: "small" | "medium";
  type?: "date" | "datetime" | "time" | "year";
  defaultValue?: string;
}

const FormikDateField: React.FC<IFormikDateField> = React.memo(
  ({
    name,
    label,
    showTodayButton,
    disableFuture,
    disablePast,
    variant,
    clearable,
    size,
    type,
    ...props
  }) => {
    const [field, meta, handlers] = useField(name);
    const errorText = meta.error && meta.touched ? meta.error : "";

    const handleChange = (date) => {
      if (moment(date).isValid()) {
        handlers.setValue(moment(date).format());
      } else {
        handlers.setValue(null);
      }
    };

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <>
          {!type ||
            (type === "date" && (
              <KeyboardDatePicker
                {...field}
                onChange={handleChange}
                label={label}
                animateYearScrolling={true}
                disableFuture={disableFuture}
                disablePast={disablePast}
                showTodayButton={showTodayButton}
                format="MM/dd/yyyy"
                clearable={clearable}
                fullWidth
                inputVariant={variant ? variant : "outlined"}
                InputLabelProps={{
                  shrink: true,
                }}
                size={size}
                autoOk={true}
                error={!!errorText}
                helperText={errorText}
              />
            ))}

          {type === "time" && (
            <TimePicker
              clearable
              ampm={false}
              {...field}
              onChange={handleChange}
              label={label}
              showTodayButton={showTodayButton}
              // format="MM/dd/yyyy"
              fullWidth
              inputVariant={variant ? variant : "outlined"}
              InputLabelProps={{
                shrink: true,
              }}
              size={size}
              autoOk={true}
              error={!!errorText}
              helperText={errorText}
            />
          )}
        </>
      </MuiPickersUtilsProvider>
    );
  }
);

export default FormikDateField;
