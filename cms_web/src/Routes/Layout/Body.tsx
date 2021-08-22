import { useMediaQuery, useTheme } from "@material-ui/core";
import clsx from "clsx";
import React, { memo } from "react";
import styled from "styled-components";
interface IBody {
  isOpenMobileHeader: boolean;
}
const Body: React.FC<IBody> = memo(({ children, isOpenMobileHeader }) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <StyledBody
      theme={theme}
      className={clsx("", {
        "expand-body": isOpenMobileHeader && mobile,
      })}
    >
      <div className="page-container">{children}</div>
    </StyledBody>
  );
});
export default Body;
const StyledBody = styled.main`
  margin-top: ${(p) => p.theme.header.height + 50}px;
  /* transition: 0.2s margin-top ease-in-out; */
  /* position: relative; */
  /* background-color: ${(p) => p.theme.body.backgroundColor}; */

  &.expand-body {
    margin-top: ${(p) => p.theme.header.height * 2 + 50}px;
    transition: 0.2s margin-top ease-in-out;
  }

  .page-container {
    min-height: calc(100vh - ${(p) => p.theme.header.height + 50}px) !important;
    max-height: calc(100vh - ${(p) => p.theme.header.height + 50}px) !important;
    overflow-y: auto !important;
    display: relative;
  }

  &.expand-body {
    .page-container {
      min-height: calc(
        100vh - ${(p) => p.theme.header.height * 2 + 50}px
      ) !important;
      max-height: calc(
        100vh - ${(p) => p.theme.header.height * 2 + 50}px
      ) !important;
    }
  }
`;
