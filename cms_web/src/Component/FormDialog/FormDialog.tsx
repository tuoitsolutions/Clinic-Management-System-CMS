import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import React, { memo, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import SlideTransition from "../Transitions/SlideTransition";

interface IFormDialog {
  open: boolean;
  title: string;
  handleClose?: () => void;
  body?: any;
  actions?: any;
  minWidth?: number;
  fullScreen?: boolean;
  scroll?: "body" | "paper";
}

export const FormDialog: React.FC<IFormDialog> = memo(
  ({
    children,
    open,
    title,
    handleClose,
    body,
    actions,
    minWidth,
    fullScreen,
    scroll,
  }) => {
    const theme = useTheme();
    const descriptionElementRef = useRef<any>(null);
    const mobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));
    const dispatch = useDispatch();
    const { radResultNo } = useParams<any>();

    useEffect(() => {
      let mounted = true;

      const initializeData = () => {};

      mounted && open && initializeData();

      return () => {
        mounted = false;
      };
    }, [dispatch, radResultNo, open]);

    useEffect(() => {
      let mounted = true;

      if (open && mounted) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
          descriptionElement.focus();
        }
      }

      return () => {
        mounted = false;
      };
    }, [open]);

    return (
      <Dialog
        open={open}
        scroll={"body"}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        fullScreen={fullScreen}
        PaperProps={{
          style: {
            margin: 0,
            padding: 0,
            minWidth: mobile
              ? "95%"
              : typeof minWidth === "undefined"
              ? 750
              : minWidth,
            maxWidth: mobile
              ? "95%"
              : typeof minWidth === "undefined"
              ? 750
              : minWidth,
          },
        }}
        TransitionComponent={SlideTransition}
      >
        <DialogTitleStyle theme={theme} disableTypography={true}>
          <div className="dialog-title">{title}</div>
          <div className="toolbar">
            {typeof handleClose === "function" && (
              <Tooltip title="">
                <IconButton size="small" onClick={handleClose}>
                  <CancelPresentationIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </DialogTitleStyle>

        <DialogContentStyle theme={theme}>{body}</DialogContentStyle>

        {!!actions && (
          <DialogActionsStyle className="form-footer">
            {actions}
          </DialogActionsStyle>
        )}
      </Dialog>
    );
  }
);

export default FormDialog;

const DialogTitleStyle = styled(DialogTitle)`
  background-color: ${(p) => p.theme.palette.primary.main} !important;
  display: grid;
  grid-auto-flow: column;
  font-size: 0.9em;
  align-items: center;
  align-content: center;
  font-weight: 500 !important;
  grid-gap: 1em;

  .dialog-title {
    /* color: ${(p) => p.theme.palette.primary.contrastText} !important; */
    color: #fff !important;
    font-weight: 900;
    /* font-size: 0.87em; */
  }

  .toolbar {
    justify-self: end;
    display: grid;
    grid-auto-flow: column;
    grid-gap: 0.5em;
    color: ${(p) => p.theme.palette.primary.contrastText};
    align-items: center;
    align-content: center;

    .MuiSvgIcon-root {
      color: ${(p) => p.theme.palette.primary.contrastText};
    }
  }
`;

const DialogContentStyle = styled(DialogContent)`
  /* padding: 2em; */
  background-color: ${(p) => p.theme.palette.common.white};
`;
const DialogActionsStyle = styled(DialogActions)`
  /* background-color: #f0f0f0; */
`;
