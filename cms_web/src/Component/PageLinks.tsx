import {
  AppBar,
  Breadcrumbs,
  Paper,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { memo, FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import clsx from "clsx";
interface ILink {
  link: string;
  title: string;
}

interface IPageLinks {
  links: Array<ILink>;
  isOpenMobileHeader?: boolean;
}

const PageLinks: FC<IPageLinks> = memo(({ links, isOpenMobileHeader }) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <StyledPageLinks
      theme={theme}
      className={clsx("", {
        "expand-navlinks": isOpenMobileHeader && mobile,
      })}
    >
      <Breadcrumbs aria-label="breadcrumb" className="bread-crumb">
        {links.map((v, i) => (
          <Link
            key={i}
            // color="inherit"
            // color="textPrimary"
            // style={{
            //   marginLeft: i > 0 ? -60 : `auto`,
            //   zIndex: i,
            // }}
            href={v.link}
            to={v.link}
            className="navText"
            aria-current="page"
          >
            {v.title}
          </Link>
        ))}
      </Breadcrumbs>
    </StyledPageLinks>
  );
});

export default PageLinks;

const StyledPageLinks = styled(AppBar)`
  height: 50px;
  max-height: 50px;
  display: grid !important;
  align-content: center !important;

  box-shadow: none !important;
  margin-top: ${(p) => p.theme.header.height}px !important;
  transition: 0.2s margin-top ease-in-out !important;
  width: 100vw;
  background-color: ${(p) => p.theme.body.backgroundColor};
  &.expand-navlinks {
    transition: 0.2s margin-top ease-in-out !important;
    margin-top: ${(p) => p.theme.header.height * 2}px !important;
  }

  .bread-crumb {
    padding: 0 1em;

    /* .navText {
      text-decoration: none !important;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
      border-radius: 40px;
      padding: 5px 16px;
      padding-right: 50px;
      background-color: #fff !important;
    } */
  }
`;
