import { Drawer, IconButton, useMediaQuery, useTheme } from "@material-ui/core";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import React, { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import styled from "styled-components";
import CustomAvatar from "../../Component/CustomAvatar";
import NavSidebarDropDown from "../../Component/NavLinks/NavSidebarDropDown";
import { APP_NAME } from "../../Helpers/AppConfig";
import { RootStore } from "../../Services/Store";
import { IPageNavLinks } from "./Layout";
interface IMobileSidebar {
  PageNavLinks: Array<IPageNavLinks>;
  isOpenMobileSidebar: boolean;
  handleCloseMobileSidebar: () => void;
  user: any;
}

const MobileSidebar: React.FC<IMobileSidebar> = memo(
  ({ PageNavLinks, isOpenMobileSidebar, handleCloseMobileSidebar, user }) => {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("sm"));
    const history = useHistory();

    const fetch_hospital_logo = useSelector(
      (store: RootStore) => store.DefaultValuesReducer.fetch_hospital_logo
    );
    const hospital_logo = useSelector(
      (store: RootStore) => store.DefaultValuesReducer.hospital_logo
    );

    const fetch_hospital_name = useSelector(
      (store: RootStore) => store.DefaultValuesReducer.fetch_hospital_name
    );
    const hospital_name = useSelector(
      (store: RootStore) => store.DefaultValuesReducer.hospital_name
    );

    const fetch_hospital_tagline = useSelector(
      (store: RootStore) => store.DefaultValuesReducer.fetch_hospital_tagline
    );
    const hospital_tagline = useSelector(
      (store: RootStore) => store.DefaultValuesReducer.hospital_tagline
    );

    useEffect(() => {
      let mounted = true;

      if (mounted) {
        handleCloseMobileSidebar();
      }

      return () => {
        mounted = false;
      };
    }, [handleCloseMobileSidebar, mobile]);

    return (
      <StyledMobileSidebar
        theme={theme}
        open={isOpenMobileSidebar}
        PaperProps={{
          className: "sidebar-container",
        }}
        onClose={handleCloseMobileSidebar}
      >
        <div className="brand">
          {/* <Avatar src={logo} className="brand-logo" alt="" /> */}
          <CustomAvatar
            src={hospital_logo}
            className="brand-logo"
            isBlob
            spacing={10}
            alt={hospital_name?.charAt(0)}
          />
          <div className="brand-name">{hospital_name}</div>
          <div className="app-name">{APP_NAME}</div>

          <IconButton
            className="btn-close-drawer"
            color="primary"
            onClick={handleCloseMobileSidebar}
          >
            <MenuOpenIcon />
          </IconButton>
        </div>

        <nav className="nav">
          {PageNavLinks.map((nav, index) =>
            nav.hasSubLinks ? (
              <NavSidebarDropDown
                isActive={history.location.pathname
                  .toLowerCase()
                  .includes(nav.parentKey ? nav.parentKey.toLowerCase() : "")}
                text={nav.text}
                navLinks={nav.navLinks ? nav.navLinks : []}
                key={index}
              />
            ) : (
              <NavLink
                key={index}
                activeClassName="dropdown-link-item-active"
                to={nav.to}
                className="nav-item"
              >
                <div className="nav-item-label">{nav.text}</div>
              </NavLink>
            )
          )}
        </nav>
      </StyledMobileSidebar>
    );
  }
);

export default MobileSidebar;

export const StyledMobileSidebar = styled(Drawer)`
  .sidebar-container {
    width: ${(p) => p.theme.sidebar.maxWidth}px;
    min-width: ${(p) => p.theme.sidebar.maxWidth}px;
    display: grid;
    grid-auto-rows: ${(p) => p.theme.header.height}px 1fr;

    .brand {
      display: grid;
      grid-auto-flow: column;
      width: ${(p) => p.theme.sidebar.maxWidth}px;
      align-content: center;
      align-items: center;
      justify-items: start;
      justify-content: start;
      grid-gap: 0.5em;
      padding: 0 0.5em;
      background-color: ${(p) => p.theme.palette.primary.main};
      color: ${(p) => p.theme.palette.primary.contrastText};
      grid-template-areas: "logo name icon" "logo app icon";
      grid-auto-columns: 40px 1fr 40px;

      .brand-logo {
        grid-area: logo;
        height: 40px;
        width: 40px;
      }

      .brand-name {
        grid-area: name;
        align-self: start;
        white-space: pre-wrap;
        text-transform: capitalize;
        font-weight: 600;
        font-size: 0.78em;
      }

      .app-name {
        align-self: end;
        justify-self: center;
        grid-area: app;
        white-space: nowrap;
        justify-self: start;
        white-space: pre-wrap;
        text-transform: capitalize;

        font-weight: 600;
        font-size: 0.8em;
        white-space: pre-wrap;
      }

      .btn-close-drawer {
        justify-self: end;
        grid-area: icon;
      }
    }

    .nav {
      width: 100%;
      display: grid;
      grid-auto-flow: row;
      align-items: start;
      align-content: start;
      padding: 1em 0.5em;
      grid-gap: 0.7em;
      text-transform: uppercase;

      .nav-item {
        transition: 0.2s all ease-in-out;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        align-content: center;
        /* grid-gap: 1em; */
        padding: 0 0.3em;
        width: 100%;
        grid-auto-columns: 1fr;
        border-radius: 10px;
        justify-items: start;

        &:hover {
          cursor: pointer;
          color: #3443e5;
        }

        &.dropdown-link-item-active {
          color: #3443e5 !important;
        }

        .nav-item-label {
          font-size: 1em;
          text-transform: capitalize;
          font-weight: 500;
        }
      }
    }
  }
`;
