import {
  FormHelperText,
  IconButton,
  ListItemSecondaryAction,
} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import CloudUpload from "@material-ui/icons/CloudUpload";
import InsertDriveFile from "@material-ui/icons/InsertDriveFile";
import React from "react";
import Dropzone from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fafafa",
    textAlign: "center",
    cursor: "pointer",
    color: "#333",
    border: `none`,
    padding: "10px",
    marginTop: "20px",
  },
  icon: {
    marginTop: "16px",
    color: "#888888",
    fontSize: "42px",
  },
}));

interface IDropzoneFieldHookForm {
  name: string;
  accept?: string;
  label?: string;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
}

const DropzoneFieldHookForm: React.FC<IDropzoneFieldHookForm> = ({
  name,
  accept,
  label,
  multiple,
  maxFiles,
  disabled,
}) => {
  const { control, errors, getValues, setValue, trigger } = useFormContext();
  const styles = useStyles();

  let error = false;
  let error_message = "";

  if (errors && errors?.hasOwnProperty(name)) {
    error = true;
    error_message = errors[name]?.message;
  }

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ onChange, name, onBlur, value }) => {
        return (
          <>
            <Dropzone
              maxFiles={maxFiles}
              multiple={multiple}
              accept={accept}
              onDrop={onChange}
              disabled={disabled}
            >
              {({ getRootProps, getInputProps }) => (
                <Paper
                  // variant="outlined"
                  className={styles.root}
                  {...getRootProps()}
                >
                  <CloudUpload className={styles.icon} />
                  <input {...getInputProps()} name={name} onBlur={onBlur} />
                  <p>{label}</p>
                  <FormHelperText error={error}>{error_message}</FormHelperText>
                </Paper>
              )}
            </Dropzone>

            <List>
              {value?.map((f, index) => {
                console.log(`value`, value);
                console.log(`file`, f);
                return (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <InsertDriveFile />
                    </ListItemIcon>
                    <ListItemText primary={f.name} secondary={f.size} />
                    {/* <ListItemText primary={f.name} secondary={f.size} /> */}
                    <ListItemSecondaryAction
                      onClick={() => {
                        const files = getValues(name);
                        if (files instanceof Array) {
                          files.splice(index, 1);
                        }

                        setValue(name, [...files], {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                    >
                      <IconButton edge="end" aria-label="comments">
                        <CloseRoundedIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </>
        );
      }}
    />
  );
};

export default DropzoneFieldHookForm;
