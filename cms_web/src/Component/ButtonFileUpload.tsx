import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { memo } from "react";

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

export const ButtonFileUpload = memo(({ children }) => {
  const classes = useStyles();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`e`, e.target.files[0]);
  };

  return (
    <div className={classes.root}>
      <input
        accept="image/*,.doc,.docx,.pdf,.rtf"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        onChange={handleChange}
      />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="primary"
          disableElevation
          component="span"
        >
          {children}
        </Button>
      </label>
    </div>
  );
});

export default ButtonFileUpload;
