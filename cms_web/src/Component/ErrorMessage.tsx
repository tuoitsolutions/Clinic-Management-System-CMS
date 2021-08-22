import React, { memo, FC } from "react";

interface IErrorMessage {
  message: string;
}

export const ErrorMessage: FC<IErrorMessage> = memo(({ message }) => {
  return (
    <div
      style={{
        width: `100%`,
        minHeight: `60vh`,
        display: `grid`,
        alignItems: `center`,
        justifyItems: `center`,
        color: `red`,
        fontSize: `1.3em`,
        fontWeight: 400,
      }}
    >
      {message}
    </div>
  );
});

export default ErrorMessage;
