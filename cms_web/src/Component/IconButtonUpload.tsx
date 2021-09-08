import React, { memo } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: "none",
    },
  })
);

interface IIconButtomUpload {
  accept: string;
  IconComponent: any;
  handleChange: (e: any) => void;
  size?: "medium" | "small";
  className?: string;
}

const IconButtomUpload: React.FC<IIconButtomUpload> = memo(
  ({ accept, IconComponent, handleChange, size, className }) => {
    const classes = useStyles();

    return (
      <div className={className}>
        <input
          accept={accept}
          className={classes.input}
          id="icon-button-file"
          type="file"
          onChange={(e) => handleChange(e.target.files)}
        />
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            size={size}
          >
            {IconComponent}
          </IconButton>
        </label>
      </div>
    );
  }
);

export default IconButtomUpload;
