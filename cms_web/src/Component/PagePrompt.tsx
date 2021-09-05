import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@material-ui/core";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import React, { memo, useCallback, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { resetGeneralPrompt } from "../Services/Actions/PageActions";
import { RootStore } from "../Services/Store";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import SlideTransition from "./Transitions/SlideTransition";
interface IPagePrompt {}

export const PagePrompt: FC<IPagePrompt> = memo(() => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const {
    open,
    custom_title,
    custom_subtitle,
    continue_callback,
    close_callback,
  } = useSelector((state: RootStore) => state.PageReducer.page_prompt);

  const handleContinue = useCallback(() => {
    if (continue_callback) {
      dispatch(resetGeneralPrompt());

      if (typeof continue_callback === "function") {
        continue_callback();
      }
    }
  }, [continue_callback, dispatch]);
  const handleCancel = useCallback(() => {
    dispatch(resetGeneralPrompt());
    if (close_callback) {
      if (typeof close_callback === "function") {
        close_callback();
      }
    }
  }, [close_callback, dispatch]);

  return (
    <StyledPagePrompt
      theme={theme}
      open={open}
      scroll="body"
      disableBackdropClick={true}
      onEscapeKeyDown={() => {
        handleCancel();
      }}
      TransitionComponent={SlideTransition}
      PaperProps={{
        style: {
          margin: 0,
          padding: 0,
          // borderRadius: 10,
          width: 400,
          overflowY: "visible",
        },
      }}
    >
      <DialogTitle>
        <div
          style={{
            display: "grid",
            justifyItems: "center",
            justifyContent: "center",
            marginTop: "-50px",
          }}
        >
          <Avatar
            style={{
              height: "3.5em",
              width: "3.5em",
              backgroundColor: "#ff9800",
            }}
          >
            <WarningRoundedIcon fontSize="large" />
          </Avatar>
        </div>
      </DialogTitle>

      <DialogContent className="dialog-content">
        <div className="prompt-title">
          {custom_title
            ? custom_title
            : "Are you sure that you want to continue?"}
        </div>
        <div className="prompt-sub">
          {custom_subtitle
            ? custom_subtitle
            : "If you proceed, you won't be able to revert this process."}
        </div>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button
          color="primary"
          variant="contained"
          // startIcon={<CheckRoundedIcon fontSize="small" />}
          // disableElevation
          onClick={handleContinue}
        >
          Yes, Continue
        </Button>
        <Button
          color="secondary"
          variant="contained"
          // startIcon={<CloseRoundedIcon fontSize="small" />}
          onClick={handleCancel}
          // disableElevation
        >
          No, Cancel
        </Button>
      </DialogActions>
    </StyledPagePrompt>
  );
});

export default PagePrompt;

const StyledPagePrompt = styled(Dialog)`
  .dialog-content {
    margin-bottom: 1em;
    text-align: center;
    display: grid;
    grid-gap: 1em;

    .prompt-title {
      font-weight: 900;
      color: rgba(0, 0, 0, 0.7);
    }

    .prompt-sub {
      font-size: 0.75em;
      color: ${(p) => p.theme.palette.warning.main};
    }
    .big-text {
      color: red;
      font-weight: 600;
      font-size: 1.1em;
    }
    .small-text {
      font-size: 0.87em;
    }
  }
`;
