import { AppBar, IconButton, useMediaQuery, useTheme } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import clsx from "clsx";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import CustomAvatar from "../../Component/CustomAvatar";
import PageLinks from "../../Component/PageLinks";
import UserProfile from "../../Component/UserProfile/UserProfile";
import { APP_NAME } from "../../Helpers/AppConfig";
import { RootStore } from "../../Services/Store";
import { IPageNavLinks } from "./Layout";

interface IHeader {
  PageNavLinks: Array<IPageNavLinks>;
  isOpenMobileHeader: boolean;
  isOpenMobileSidebar: boolean;
  handleToggleHeader: () => void;
  handleToggleSidebar: () => void;
  user: any;
}

const Header: React.FC<IHeader> = memo(
  ({
    PageNavLinks,
    isOpenMobileHeader,
    handleToggleHeader,
    handleToggleSidebar,
    isOpenMobileSidebar,
    user,
  }) => {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("sm"));

    const hospital_logo = useSelector(
      (store: RootStore) => store.DefaultValuesReducer.hospital_logo
    );

    const hospital_name = useSelector(
      (store: RootStore) => store.DefaultValuesReducer.hospital_name
    );

    const page_links = useSelector(
      (store: RootStore) => store.PageReducer.page_links
    );

    return (
      <>
        <StyledHeader
          theme={theme}
          className={clsx("", {
            "mobile-menu-open": isOpenMobileHeader && mobile,
          })}
        >
          <IconButton className="btn-open-drawer" onClick={handleToggleSidebar}>
            <MenuIcon />
          </IconButton>

          <div
            className="brand"
            style={{
              opacity: isOpenMobileSidebar ? 0 : 1,
            }}
          >
            <CustomAvatar
              src={hospital_logo}
              className="brand-logo"
              alt={hospital_name}
              isBlob
              spacing={5}
            />
            <div className="brand-name">{hospital_name}</div>
            <div className="app-name">{APP_NAME}</div>
          </div>

          <nav className="nav">
            {PageNavLinks.map((nav, index) => (
              <NavLink
                key={index}
                activeClassName="nav-item-active"
                to={nav.to}
                className="nav-item"
              >
                <div className="nav-item-label">{nav.text}</div>
              </NavLink>
            ))}
          </nav>

          <section className="tools">
            {/* <Notification />
            <Message /> */}

            {/* {user?.username?.toLowerCase().trim() === "pgh" && (
              <OnlineUsersMenu />
            )} */}
            <UserProfile user={user} variant={mobile ? "mobile" : "desktop"} />
          </section>

          <IconButton className="btn-open-menu" onClick={handleToggleHeader}>
            <MoreVertIcon />
          </IconButton>
        </StyledHeader>
        <PageLinks isOpenMobileHeader={isOpenMobileHeader} links={page_links} />
      </>
    );
  }
);

export default Header;

const StyledHeader = styled(AppBar)`
  height: ${(p) => p.theme.header.height}px!important;
  display: grid !important;
  grid-auto-flow: column !important;
  grid-auto-columns: ${(p) => p.theme.sidebar.maxWidth}px 1fr 1fr;
  grid-gap: 2em !important;
  padding: 0 0.5em !important;
  transition: 0.2s all ease-in-out !important;
  background-color: ${(p) => p.theme.palette.primary.main.dark} !important;

  .brand {
    display: grid;
    grid-auto-flow: column;
    width: ${(p) => p.theme.sidebar.maxWidth}px;
    align-content: center;
    align-items: center;
    justify-items: start;
    justify-content: start;
    grid-template-areas: "logo name" "logo app";
    grid-gap: 0.3em;

    .brand-logo {
      grid-area: logo;
      margin-right: 0.2em;
    }

    .brand-name {
      width: ${(p) => p.theme.sidebar.maxWidth - 50}px;
      grid-area: name;
      text-transform: capitalize !important;
      white-space: pre-wrap;
      align-self: start;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      align-self: end;
      font-weight: 900;
      font-size: 0.87em !important;

      @media only screen and (max-width: ${(props) =>
          props.theme.breakpoints.values.sm}px) {
        white-space: unset !important;
        overflow: unset !important;
        text-overflow: unset !important;
        font-size: 0.8em !important;
      }
    }

    .app-name {
      align-self: start;
      justify-self: center;
      grid-area: app;
      white-space: nowrap;
      justify-self: start;
      font-weight: 600 !important;
      font-size: 0.7em !important;
      white-space: pre-wrap;
      width: ${(p) => p.theme.sidebar.maxWidth - 50}px;
    }
  }

  .nav {
    justify-self: start;
    display: grid;
    grid-auto-flow: column;
    justify-self: start;
    justify-content: start;
    align-items: center;
    align-content: center;
    grid-gap: 1rem;
    .nav-item {
      transition: 0.1s all ease-in-out;
      justify-self: center;
      display: grid;
      text-align: center;
      align-items: center;
      align-content: center;
      align-self: center;
      justify-items: center;
      justify-content: center;
      color: ${(p) => p.theme.palette.secondary.main} !important;
      font-size: 0.9em;
      font-weight: 500;
      color: ${(p) => p.theme.palette.customize.headerTextColor} !important;

      &.nav-item-active {
        opacity: 1;
        color: ${(p) => p.theme.header.activeNavColor} !important;
      }

      .nav-item-label {
        text-transform: capitalize;
        &:hover {
          opacity: 0.9;
          color: ${(p) => p.theme.header.activeNavColor} !important;
        }
      }
    }
  }

  .tools {
    justify-self: end;
    display: grid;
    grid-gap: 1em;
    grid-auto-flow: column;
    align-items: center;
  }

  .btn-open-drawer,
  .btn-open-menu {
    display: none;
    align-self: center;
    justify-self: center;
    color: ${(p) => p.theme.palette.customize.headerTextColor} !important;
  }

  /* MOBILE SCREEN */
  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.values.md}px) {
    display: grid !important;
    grid-gap: 0 !important;
    grid-auto-columns: auto 1fr auto !important;
    grid-template-areas: "btn-drawer brand btn-menu" "menu menu menu" !important;
    grid-auto-rows: ${(p) => p.theme.header.height}px
      ${(p) => p.theme.header.height}px!important;
    overflow: hidden !important;
    height: ${(p) => p.theme.header.height}px!important;

    &.mobile-menu-open {
      transition: 0.2s all ease-in-out !important;
      height: ${(p) => p.theme.header.height * 2}px !important;

      overflow: visible;
      align-items: center;

      .tools {
        display: grid;
        align-items: center;
        align-content: center;
        align-self: center;
      }
    }

    .btn-open-drawer {
      grid-area: btn-drawer;
      display: grid;
    }

    .btn-open-menu {
      grid-area: btn-menu;
      display: grid;
    }

    .brand {
      grid-area: brand;
      justify-self: center;
      align-content: center;
      align-items: center;
      justify-items: start;
      justify-content: start;
      width: unset !important;

      * {
        width: unset !important;
      }
    }
    .tools {
      grid-area: menu;
    }

    .nav {
      display: none;
    }
  }
`;
