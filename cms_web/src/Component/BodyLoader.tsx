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
        // minHeight: `60vh`,
        // height: `60vh`,
        display: `grid`,
        margin: `1em`,
        padding: `1em`,
        alignItems: `center`,
        alignContent: `center`,
        justifyItems: `center`,
        justifyContent: `center`,
        textAlign: `center`,
      }}
    >
      <BoxLoader />
      <div>{message}</div>
    </div>
  );
});

export default BodyLoader;
