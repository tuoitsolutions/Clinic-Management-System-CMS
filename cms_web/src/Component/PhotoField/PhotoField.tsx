import {
  Avatar,
  Badge,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import { Skeleton } from "@material-ui/lab";
import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
interface IPhotoField {
  selectedFile: File | null;
  handleChange: (e: File | null) => any;
  name?: string;
  label?: string;
  spacing?: number;
  variant?: any;
  className?: any;
  alt?: string;
  loading?: boolean;
}

const PhotoField: React.FC<IPhotoField> = memo(
  ({
    selectedFile,
    handleChange,
    name,
    label,
    spacing,
    className,
    alt,
    variant,
    loading,
  }) => {
    const theme = useTheme();
    const [preview, set_preview] = useState<any>(null);

    const onSelectFile = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
          handleChange(undefined);
          return;
        }

        if (e.target.files[0]) {
          handleChange(e.target.files[0]);
        }
      },
      [handleChange]
    );

    useEffect(() => {
      if (!selectedFile) {
        set_preview(null);
        return;
      }

      const objectUrl = URL.createObjectURL(selectedFile);
      set_preview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    return (
      <div className={className}>
        <div
          style={{
            fontSize: ".78em",
            fontWeight: 400,
            color: "rgba(0,0,0,.7)",
            marginBottom: "1em",
          }}
        >
          {label}
        </div>
        {loading ? (
          <Skeleton
            variant="circle"
            style={{
              height: theme.spacing(spacing ? spacing : 4),
              width: theme.spacing(spacing ? spacing : 4),
            }}
            animation="wave"
          />
        ) : (
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
                    onChange={onSelectFile}
                    type="file"
                    accept="image/x-png,image/gif,image/jpeg"
                  />
                </div>
              </Tooltip>
            }
          >
            {!!preview ? (
              <>
                <Avatar
                  style={{
                    height: theme.spacing(spacing ? spacing : 4),
                    width: theme.spacing(spacing ? spacing : 4),
                  }}
                  src={preview}
                  alt=""
                  variant={variant}
                  onError={() => {
                    set_preview(alt);
                  }}
                />
              </>
            ) : (
              <>
                <Avatar
                  style={{
                    height: theme.spacing(spacing ? spacing : 4),
                    width: theme.spacing(spacing ? spacing : 4),
                  }}
                  src={alt}
                  alt=""
                  onError={() => {
                    set_preview(alt);
                  }}
                  variant={variant}
                />
              </>
            )}
          </StyledImageField>
        )}
      </div>
    );
  }
);

export default PhotoField;

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
