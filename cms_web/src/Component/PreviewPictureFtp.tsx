import { Avatar, Badge, useTheme } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import img_def_patient from "../Assets/Images/Icons/patient.png";
import ResponseModel from "../Services/Models/ServerResponseModel";

interface IPreviewPictureFtp {
  spacing?: number;
  variant?: any;
  className?: string;
  api_func: (params?: any) => Promise<ResponseModel>;
  api_params: any;
  watch_change?: string;
}

const PreviewPictureFtp: React.FC<IPreviewPictureFtp> = memo(
  ({ spacing, className, variant, api_func, api_params, watch_change }) => {
    const theme = useTheme();
    const [preview, set_preview] = useState<any>(null);

    const [loading_preview, set_loading_preview] = useState(false);

    useEffect(() => {
      let mounted = true;

      const load_initial_data = async () => {
        if (typeof api_func === "function") {
          set_loading_preview(true);

          const response = await api_func(api_params);

          if (response.success) {
            if (!!response?.data) {
              set_preview(response?.data);
            } else {
              set_preview(null);
            }
          } else {
            set_preview(null);
          }

          set_loading_preview(false);
        }
      };

      mounted && !!watch_change && load_initial_data();
      return () => (mounted = false);
    }, [api_params, watch_change]);

    return (
      <div className={className}>
        {loading_preview ? (
          <Skeleton
            variant="circle"
            style={{
              height: theme.spacing(spacing ? spacing : 4),
              width: theme.spacing(spacing ? spacing : 4),
            }}
            animation="wave"
          />
        ) : (
          <>
            {!!preview ? (
              <Avatar
                style={{
                  height: theme.spacing(spacing ? spacing : 4),
                  width: theme.spacing(spacing ? spacing : 4),
                }}
                src={preview}
                alt={img_def_patient}
                variant={variant}
                onError={() => {
                  set_preview(img_def_patient);
                }}
              />
            ) : (
              <Avatar
                style={{
                  height: theme.spacing(spacing ? spacing : 4),
                  width: theme.spacing(spacing ? spacing : 4),
                }}
                src={img_def_patient}
                variant={variant}
              />
            )}
          </>
        )}
      </div>
    );
  }
);

export default PreviewPictureFtp;

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
