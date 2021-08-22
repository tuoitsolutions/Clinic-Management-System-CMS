import { Badge, Button, IconButton, Paper, Popover } from "@material-ui/core";
import MoreHorizRoundedIcon from "@material-ui/icons/MoreHorizRounded";
import React, { memo } from "react";
import styled from "styled-components";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@material-ui/icons/ExpandLessRounded";
interface IButtonPopper {
  buttonColor?: "inherit" | "primary" | "secondary" | "default" | undefined;
  iconColor?:
    | "inherit"
    | "disabled"
    | "action"
    | "primary"
    | "secondary"
    | "error"
    | undefined;
  buttons: Array<IButtonItem>;
  variant?: "text" | "outlined" | "contained";
  actionLabel: string;
}

export interface IButtonItem {
  text: string;
  Icon?: any;
  handleClick?: () => void;
  color?: "inherit" | "primary" | "secondary" | "default" | undefined;
  disabled?: boolean;
  badge_value?: string | number;
}

const ButtonPopper: React.FC<IButtonPopper> = memo(
  ({ buttonColor, buttons, variant, actionLabel }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
      null
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
      <div>
        <Button
          color={buttonColor}
          aria-describedby={id}
          onClick={handleClick}
          endIcon={open ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
          variant={variant}
        >
          {actionLabel}
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <PopperContent>
            {buttons.length <= 0 && (
              <div
                style={{
                  fontSize: `.8em`,
                  padding: `1em`,
                }}
                className="empty-rows"
              >
                Nothing to do here
              </div>
            )}
            {buttons.map((btn: IButtonItem, index: number) =>
              !!btn.badge_value ? (
                <Badge badgeContent={btn.badge_value} color="secondary">
                  <Button
                    key={index}
                    className="btn"
                    color="primary"
                    disabled={btn.disabled}
                    onClick={() => {
                      handleClose();
                      if (typeof btn.handleClick !== "undefined") {
                        btn.handleClick();
                      }
                    }}
                  >
                    {btn.text}
                  </Button>
                </Badge>
              ) : (
                <Button
                  key={index}
                  className="btn"
                  color="primary"
                  disabled={btn.disabled}
                  onClick={() => {
                    handleClose();
                    if (typeof btn.handleClick !== "undefined") {
                      btn.handleClick();
                    }
                  }}
                >
                  {btn.text}
                </Button>
              )
            )}
          </PopperContent>
        </Popover>
      </div>
    );
  }
);

export default ButtonPopper;

const PopperContent = styled(Paper)`
  padding: 1em 2em;
  display: grid;
  grid-gap: 0.5em;
  min-width: 150px;
  justify-content: center;
  justify-items: center;
  align-content: start;
  align-items: start;

  .btn {
    &.Mui-disabled {
      /* color: gray !important; */
      opacity: 0.5 !important;
    }
  }
  /* .MuiButton-label {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 0.2em;
    justify-content: start;
    justify-items: start;
    align-items: center;
    align-content: center;
  } */
`;
