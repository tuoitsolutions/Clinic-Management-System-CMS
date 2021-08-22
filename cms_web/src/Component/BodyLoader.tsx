import React, { memo, FC } from "react";
import BoxLoader from "../Assets/loaders/BoxLoader";

interface IBodyLoader {
  message?: string;
}

export const BodyLoader: FC<IBodyLoader> = memo(({ message }) => {
  return (
    <div
      style={{
        width: `100%`,
        minHeight: `60vh`,
        display: `grid`,
        margin: `1em`,
        alignItems: `start`,
        alignContent: `start`,
        justifyItems: `center`,
        justifyContent: `center`,
      }}
    >
      <BoxLoader />
      <div>{message}</div>
    </div>
  );
});

export default BodyLoader;
