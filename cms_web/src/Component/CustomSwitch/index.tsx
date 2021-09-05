import {
  FormGroup,
  FormControlLabel,
  Switch,
  withStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import React, { memo, FC, Props } from "react";

interface ICustomSwitch {
  checked: boolean;
  handleChange: () => any;
}

const IOSSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      "&$checked": {
        transform: "translateX(16px)",
        color: theme.palette.common.white,
        "& + $track": {
          backgroundColor: "#52d869",
          opacity: 1,
          border: "none",
        },
      },
      "&$focusVisible $thumb": {
        color: "#52d869",
        border: "6px solid #fff",
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(["background-color", "border"]),
    },
    checked: {},
    focusVisible: {},
  })
)(({ classes, ...props }: any) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const CustomSwitch: FC<ICustomSwitch> = memo(({ handleChange, checked }) => {
  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={<IOSSwitch checked={checked} onChange={handleChange} />}
          label="Yes"
        />
      </FormGroup>
    </>
  );
});

export default CustomSwitch;
