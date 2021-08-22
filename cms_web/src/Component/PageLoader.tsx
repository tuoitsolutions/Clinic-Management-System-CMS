import { Backdrop, Typography, useTheme } from "@material-ui/core";
import React, { FC, memo } from "react";
import { useSelector } from "react-redux";
import BoxLoader from "../Assets/loaders/BoxLoader";
import { RootStore } from "../Services/Store";
interface IPageLoader {}

export const PageLoader: FC<IPageLoader> = memo(() => {
  const theme = useTheme();

  const { show, loading_message } = useSelector(
    (state: RootStore) => state.PageReducer.page_loading
  );

  return (
    <Backdrop
      style={{
        zIndex: theme.zIndex.modal + 200,
        color: "#fff",
        display: "grid",
        // gridAutoFlow: "row",
        gridGap: "1em",
        minWidth: `100vw`,
        minHeight: `100vh`,
        alignContent: `center`,
        alignItems: `center`,
        justifyContent: `center`,
        justifyItems: `center`,
      }}
      open={show}
    >
      <div>
        <BoxLoader />
      </div>
      <Typography variant="h6">{loading_message}</Typography>
    </Backdrop>
  );
});

export default PageLoader;
