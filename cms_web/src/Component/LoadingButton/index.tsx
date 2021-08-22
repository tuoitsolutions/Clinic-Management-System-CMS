import { Button, CircularProgress } from "@material-ui/core";
import React from "react";
import { StyledLoadingButton } from "./styles";

interface IProps {
  // className :
  type?: "button" | "submit" | "reset";
  color?: "inherit" | "primary" | "secondary" | "default" | undefined;
  size?: "small" | "medium" | "large" | undefined;
  variant?: "text" | "outlined" | "contained";
  loading?: boolean;
  disabled?: boolean;
  handleClick?: () => void;
  fullWidth?: boolean;
  className?: string | undefined;
  form?: string;
}

const LoadingButton: React.FC<IProps> = ({
  type,
  color,
  disabled,
  loading,
  variant,
  handleClick,
  size,
  fullWidth,
  className,
  children,
  form,
}) => {
  return (
    <StyledLoadingButton>
      <Button
        className={`btn ${className}`}
        type={type}
        color={color}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        onClick={handleClick}
        fullWidth={fullWidth}
        form={form}
        // disableElevation
      >
        {children}
      </Button>
      {loading && <CircularProgress size={22} className="loader" />}
    </StyledLoadingButton>
  );
};

export default LoadingButton;
