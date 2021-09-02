import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledOnlineConsultLink = styled(Container)`
  /* background-color: gray; */
  /* padding: 1em; */
  overflow: hidden;

  .header-ctnr {
    display: grid;
    grid-template-areas: "logo name" "logo app" "title title";
    grid-auto-columns: auto 1fr;
    align-items: center;
    align-content: center;
    justify-content: center;
    background-color: ${(p) => p.theme.palette.primary.main};
    color: ${(p) => p.theme.palette.primary.contrastText};
    padding: 0 0.5em !important;
    left: 0 !important;
    right: 0 !important;
    margin-left: auto !important;
    margin-right: auto !important;
    max-width: 100% !important;
    min-width: 100% !important;
    grid-gap: 0.3em;
    max-height: 65px;
    min-height: 65px;
    height: 65px;
    .brand-logo {
      grid-area: logo;
      margin-right: 0.5em;
    }
    .brand-name {
      grid-area: name;
      align-self: end;
      font-weight: 900;
      font-size: 0.75em;
    }
    .app-name {
      grid-area: app;
      align-self: start;
      font-weight: 600;
      font-size: 0.7em;
    }
  }
  .main-title {
    padding: 0.5em 1em;
    font-weight: 500;
    font-size: 1em;
  }

  .top-margin {
    margin-top: 60px !important;
  }

  .content-ctnr {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 1.5em;
    height: 100%;
    grid-template-areas: "video chat";
    min-height: 600px;

    /* xs up */
    @media all and (min-width: ${(props) =>
        props.theme.breakpoints.values.xs}px) {
      grid-template-areas: "video" "chat";
      grid-auto-columns: 1fr 1fr;

      .video-ctnr {
        grid-auto-rows: 85vh auto !important;
      }
    }

    /* md up */
    @media all and (min-width: ${(props) =>
        props.theme.breakpoints.values.md}px) {
      grid-template-areas: "video chat";
      grid-auto-columns: 1fr 300px;
      height: 80vh;

      .video-ctnr {
        grid-auto-rows: 1fr auto !important;
      }
    }

    .video-ctnr {
      grid-area: video;
      border-radius: 5px !important;
      overflow: hidden !important;
      width: 100%;
      min-width: 100%;
      /* grid-auto-rows: 70vh 110px; */
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

      min-height: 550px;
      display: grid;
      .vid {
        height: 100%;
      }

      .info {
        padding: 1em;
        background-color: #fff !important;
      }
    }

    .chat-ctnr {
      grid-area: chat;
      min-height: 500px;
      height: 500px;

      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      width: 100%;
      padding: 0.5em;
      background-color: #fff;
      border-radius: 5px !important;
      align-items: start;
      align-content: start;
      grid-auto-rows: auto calc(100% - 160px) auto;
      height: 100%;
      overflow-y: hidden;
    }
  }
`;
