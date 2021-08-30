import { FormHelperText, IconButton } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import CloudUpload from "@material-ui/icons/CloudUpload";
import InsertDriveFile from "@material-ui/icons/InsertDriveFile";
import React from "react";
import Dropzone from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f5f5f5",
    textAlign: "center",
    cursor: "pointer",
    color: "#333",
    border: `none`,
    padding: "10px",
  },
  icon: {
    color: "#888888",
    fontSize: "35px",
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
                  elevation={0}
                  className={styles.root}
                  style={{ boxShadow: `0 0 5px rgba(0,0,0,.1)` }}
                  {...getRootProps()}
                >
                  <CloudUpload className={styles.icon} />
                  <input {...getInputProps()} name={name} onBlur={onBlur} />
                  <div
                    style={{
                      fontSize: `.87em`,
                      fontWeight: 400,
                    }}
                  >
                    {label}
                  </div>
                  <FormHelperText error={error}>{error_message}</FormHelperText>
                </Paper>
              )}
            </Dropzone>

            <StyledListFiles>
              {value?.map((f, index) => {
                return (
                  <div key={index} className="list-file-item">
                    <div className="file-icon">
                      <InsertDriveFile />
                    </div>
                    <div className="file-name">
                      <div className="file-name-main">{f.name}</div>
                      <div className="file-name-sub">{`${f.size} kb`}</div>
                    </div>
                    <div className="file-action">
                      <IconButton
                        edge="end"
                        color="secondary"
                        aria-label="comments"
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
                        <CloseRoundedIcon color="secondary" />
                      </IconButton>
                    </div>
                  </div>
                );
              })}
            </StyledListFiles>
          </>
        );
      }}
    />
  );
};

export default DropzoneFieldHookForm;

const StyledListFiles = styled.div`
  margin-top: 1em;
  display: grid;
  font-size: 0.87em;
  grid-gap: 0.5em;
  width: 100%;
  padding: 0 1em;

  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;

  display: grid;
  grid-gap: 0.3em;
  .list-file-item {
    width: 100%;
    padding: 0.2em;
    box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.2) !important;
    display: grid;
    grid-template-areas: "icon name action";
    /* justify-items: start; */
    /* justify-content: start; */
    align-items: center;
    align-content: center;
    grid-gap: 1em;
    grid-auto-columns: auto 1fr auto;
    max-width: 100% !important;
    .file-icon {
      grid-area: icon;
      justify-self: start;
    }
    .file-name {
      grid-area: name;
      justify-self: start;
      word-break: break-all !important;
      .file-name-main {
        font-size: 1em;
      }
      .file-name-sub {
        font-size: 0.9em;
        opacity: 0.8;
      }
    }
    .file-action {
      grid-area: action;
      font-size: 0.87em;
      opacity: 0.8;
      justify-self: end;
    }
  }
`;
