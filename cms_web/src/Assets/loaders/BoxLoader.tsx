import React, { memo, FC } from "react";
import "./styles.css";
interface IBoxLoader {}

export const BoxLoader: FC<IBoxLoader> = memo(() => {
  return (
    <>
      <div className="loadingio-spinner-chunk-a9dip6bn90p">
        <div className="ldio-8jwhidwi3aa">
          <div>
            <div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default BoxLoader;
