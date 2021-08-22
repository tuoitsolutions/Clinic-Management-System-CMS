import { Avatar, Badge, IconButton, Tooltip } from "@material-ui/core";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import React, { memo, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
interface IPhotoHookForm {
  name?: string;
  label?: string;
  height?: number;
  width?: number;
  variant?: any;
}

const PhotoHookForm: React.FC<IPhotoHookForm> = memo(
  ({ name, label, height, width, variant }) => {
    const { control, errors, setValue } = useFormContext();

    let error = false;
    let error_message = "";

    if (errors && errors?.hasOwnProperty(name)) {
      error = true;
      error_message = errors[name]?.message;
    }

    const handlePreviewImage = useCallback((selected_file: any) => {
      if (!selected_file) {
        return null;
      }

      const objectUrl = URL.createObjectURL(selected_file);
      return objectUrl;
    }, []);

    return (
      <Controller
        control={control}
        name={name}
        // defaultValue={[]}
        render={({ onChange, onBlur, value }) => {
          return (
            <>
              <div>
                <StyledImageField
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  badgeContent={
                    <Tooltip title="Select a photo">
                      <div className="btn-search-photo">
                        <IconButton
                          className="btn"
                          style={{
                            backgroundColor: "#e3f2fd",
                            border: `.01em solid #90caf9`,
                          }}
                          htmlFor={name}
                          component="label"
                        >
                          <ImageSearchIcon color="primary" fontSize="small" />
                        </IconButton>

                        <input
                          id={name}
                          className="fileInput"
                          name={name}
                          type="file"
                          onChange={(f) => {
                            const file = f.target.files[0];
                            setValue(name, file, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                          //   onBlur={onBlur}
                          accept="image/x-png,image/gif,image/jpeg"
                        />
                      </div>
                    </Tooltip>
                  }
                >
                  <Avatar
                    src={handlePreviewImage(value)}
                    style={{
                      height: height,
                      width: width,
                      backgroundColor: "#fff",
                      boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1),
                  0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
                      border: ".01em solid rgba(0,0,0,.1)",
                    }}
                    variant={variant ? variant : "circle"}
                  >
                    {!value && (
                      <div
                        style={{
                          display: "grid",
                          justifyContent: "center",
                          textAlign: "center",
                          color: `rgba(0,0,0,.6)`,
                          fontWeight: 600,
                          fontSize: `.87em`,
                        }}
                      >
                        {label}
                      </div>
                    )}
                  </Avatar>
                </StyledImageField>
              </div>
            </>
          );
        }}
      />
    );
  }
);

export default PhotoHookForm;

export const StyledImageField = styled(Badge)`
  .btn-search-photo {
    display: grid;
    grid-template-areas: "content";
    .btn {
      grid-area: content;
    }
    .fileInput {
      grid-area: content;
      display: none;
      opacity: 0;
    }
  }
`;
