import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledOnlineConsultLink = styled(Container)`
  min-height: 100vh;
  /* background-color: gray; */
  padding: 1em;
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

    min-height: 60px !important;
    max-height: 60px !important;
    padding: 0.5em 1em;
    grid-gap: 0.3em;

    left: 0 !important;
    right: 0 !important;
    margin-left: auto !important;
    margin-right: auto !important;
    max-width: 100% !important;
    min-width: 100% !important;
    .brand-logo {
      grid-area: logo;
      margin-right: 0.5em;
      height: 60px;
      width: 60px;
    }
    .brand-name {
      grid-area: name;
      align-self: end;
      font-weight: 600;
    }
    .app-name {
      grid-area: app;
      align-self: start;
      font-weight: 400;
      font-size: 0.87em;
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
    grid-auto-columns: 1fr 300px;
    grid-gap: 1em;
    height: 100%;
    grid-template-areas: "video chat";

    /* align-items: start; */
    .video-ctnr {
      grid-area: video;
      border-radius: 5px !important;
      /* min-height: 70vh;
      max-height: 70vh; */
      overflow: hidden !important;
      grid-auto-rows: 70vh 110px;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);

      .vid {
        height: 100%;
        min-height: 70vh;
        max-height: 70vh;
      }

      .info {
        grid-area: info;
        height: 110px;
        background-color: #fafafa !important;
      }
    }

    .chat-ctnr {
      grid-area: chat;
      width: 100%;
      padding: 0.5em;
      min-height: 87vh;
      max-height: 87vh;
      border-radius: 5px !important;

      .chat-content {
        display: grid;
        align-items: start;
        align-content: start;
        grid-gap: 0.3em;
        height: 100%;
        max-height: 100%;
        min-height: 100%;

        .sent-msg-ctnr {
          overflow-y: auto;
          display: grid;
          align-items: start;
          align-content: start;

          max-height: calc(100%-100px) !important;
          height: calc(100%-100px) !important;
          min-height: calc(100%-100px) !important;
          max-height: 66vh;
          min-height: 66vh;
          .sent-msg-item {
            display: grid;
            padding: 0.7em;
            grid-template-areas: "img name time" "img msg msg";
            grid-auto-columns: auto 1fr;
            grid-auto-rows: auto 1fr;
            align-items: center;
            align-content: start;
            justify-content: start;
            justify-items: start;
            box-shadow: 0 3px 2px -2px rgba(0, 0, 0, 0.1);

            .img {
              margin-right: 0.5em;
              align-self: end;
            }
            .time {
              font-size: 0.67em;
              justify-self: end;
              align-self: center;
              padding: 0 0.3em;
            }
            .name {
              grid-area: name;
              font-size: 0.7em;
              padding: 0 0.3em;
              align-self: center;
              font-weight: 900;
              text-transform: capitalize;
            }
            .message {
              grid-area: msg;
              border-radius: 7px;
              padding: 0.5em 0.7em;
              align-self: start;
              font-weight: 400;
              font-size: 0.73em;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
              background-color: #fafafa;
            }
          }
        }

        .write-msg-ctnr {
          height: 100px;
          padding: 0.3em 0;
          display: grid;
          align-self: start;
          align-items: center;
          align-content: center;
          grid-auto-columns: 1fr auto;
          grid-auto-flow: column;
          grid-gap: 4px;
        }
      }
    }
  }
`;
