import { Paper } from "@material-ui/core";
import styled from "styled-components";

export const LoginStyles = styled(Paper)`
  min-height: 100vh;
  min-width: 100vw;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-areas: "login";
  background-color: #eff0f6;
  /* background-color: #f1f8e9; */

  .login-container {
    background-color: #fff;
    align-self: center;
    justify-self: center;
    display: grid;
    box-shadow: 1px 4px 8px
      ${(props) => props.theme.palette.customize.boxShadowColor};
    z-index: 2;
    /* grid-gap: 1em; */
    border-radius: 7px;
    perspective: 20px;
    overflow: hidden;

    @media all and (min-width: ${(props) =>
        props.theme.breakpoints.values.xs}px) {
      grid-auto-columns: 1fr;
      /* grid-auto-columns: 30em 25em; */
      min-height: auto;
      align-self: start;
      /* justify-self: center; */

      grid-auto-flow: row;
      grid-auto-rows: 13em 1fr;
      margin-top: 2em;
      margin-bottom: 2em;

      .slider-ctnr {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }
    }

    @media all and (min-width: ${(props) =>
        props.theme.breakpoints.values.md}px) {
      grid-auto-columns: 30em 25em;
      grid-auto-flow: column !important;
      grid-auto-rows: unset !important;
      align-self: center !important;
      min-height: unset !important;
    }

    .slider-ctnr {
      display: grid;
      grid-template-areas: "slides";

      .slides {
        height: 100%;
        width: 100%;
        grid-area: slides;
      }
    }

    .form-ctnr {
      display: grid;
      /* justify-content: center; */
      align-items: start;
      align-content: start;
      grid-gap: 0.7em;
      padding: 0.5em 1.5em;
      padding-top: 0;

      .header {
        padding: 1em 0;
        display: grid;
        align-items: start;
        align-content: start;
        justify-items: center;
        text-align: center;

        .brand-logo {
          height: 7em;
          width: 7em;
        }
        .brand-name {
          font-weight: 600;
          font-size: 1.4em;
        }
      }

      .error {
        display: grid;
        grid-auto-flow: column;
        justify-items: start;
        justify-content: start;
        align-items: center;
        font-size: 0.8em;
        font-weight: 400;
        max-width: 90%;
        /* color: ${(p) => p.theme.palette.error.main}; */
        color: red;
      }

      .body {
        display: grid;
        grid-gap: 1em;
        align-content: start;

        .body-title {
          font-size: 0.85em;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.78);
        }

        .form {
          display: grid;
          grid-gap: 1em;
          align-content: start;
          align-items: start;

          .keep-me-logged-in {
            justify-self: start;
            align-self: center;
            align-items: center;
            padding: 0;
            margin-top: -7px;
            font-weight: 300 !important;
            /* color: blue !important; */
            * {
              font-weight: 300 !important;
            }
          }

          .forgetpass {
            justify-self: end;
            align-self: center;
            padding: 0;
            font-size: 0.7rem;
            margin-top: -10px;
            color: blue !important;
            &:hover {
              color: blue !important;
              cursor: pointer;
            }

            a {
              color: #333 !important;
              text-decoration: none !important;
            }
          }

          .login-btn {
            display: grid;
            /* justify-content: center; */
            /* padding: 0 2em; */
            grid-auto-flow: row;
            grid-gap: 0.5em;
            .submit-btn {
            }
          }
        }
      }

      .footer {
        margin-top: 1em;
        border-top: 1px solid black;
        display: grid;
        justify-items: center;
        align-items: center;
        grid-gap: 0.4em;
        .login-footer-title {
          justify-self: center;
          background-color: #ecfffb;
          margin-top: -10px;
          font-size: 0.7em;
          text-align: center;
          padding: 0 0.5em;
        }

        .tuo_logo {
          height: 35px;
          width: 35px;
        }

        .tuo-name {
          font-size: 0.8em;
          z-index: -1;
        }
      }
    }
  }
`;

export const StyledImageBackground = styled.div<{ src: any }>`
  background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)),
    url("${(p: any) => p.src}") no-repeat center center;
  opacity: 0;
  background-size: cover;
  margin-left: 0;

  transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  -webkit-transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  -moz-transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  -o-transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  .app-name {
    display: grid;
    align-content: end;
    align-items: end;
    text-shadow: 0 3px 0 black;
    color: #fff;
    padding: 0.5em;
    font-size: 2.1em;
    font-weight: 600;
    text-align: center;
    letter-spacing: 1pt;
    word-spacing: 1pt;
    opacity: 0.9;
  }
  &.active {
    opacity: 1;
  }
`;
