import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledTableData = styled.div`
  /* display: grid; */
  grid-gap: 1em;
  align-content: start;
  align-items: start;
  justify-items: start;

  @media all and (min-width: ${(props) =>
      props.theme.breakpoints.values.xs}px) {
    grid-auto-flow: row;
    grid-auto-columns: auto;
  }

  @media all and (min-width: ${(props) =>
      props.theme.breakpoints.values.md}px) {
    grid-auto-flow: column;
  }

  .table-grid {
    .table-ctnr {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
  }
`;

export const StyledBox = styled.div`
  .box-title {
    padding: 0.5em 0;
    border-bottom: 4px solid rgba(0, 0, 0, 0.1);
    font-size: 0.9em;
    font-weight: 600;
  }

  .box-body {
    margin: 0.5em 0;
  }
`;

export const StyledMedContainer = styled.div`
  .content {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr));

    .med-item {
      padding: 1em;
      box-shadow: 0 2px 3px #b3e5fc;
      border-radius: 7px;
      letter-spacing: 0.3pt;
      word-spacing: 0.3pt;
      display: grid;
      grid-gap: 0.2em;

      .title {
        font-weight: 900;
      }
      .subtitle {
        font-weight: 600;
        font-size: 0.87em;
      }

      .details {
        font-weight: 600;
        font-size: 0.8em;
        opacity: 0.8;
      }
    }
  }
`;

export const StyledTextFieldRange = styled.div`
  border: 0.03em solid rgba(0, 0, 0, 0.2);
  /* width: 100%; ${(props) => props.theme.palette.primary.light} */
  border-radius: 5px;
  display: grid;
  align-items: center;
  height: 55px;
  &:hover {
    border: 1px solid ${(props) => props.theme.palette.primary.main};
  }
  label {
    margin-top: -5px;
    /* margin-left: -10px; */
    padding: 0 0.5em;
    background-color: #fff;
    justify-self: start;
    transform: translate(-6px, -6px) scale(0.75);
  }

  .input-group {
    display: grid;
    margin-bottom: 25px !important;
    margin-left: 10px;
    margin-right: 10px;
    grid-gap: 2px;
    input {
      width: auto;
      border: none;
      height: 100%;
      font-size: 1.1em;
      /* border-bottom: 1px solid black; */
      width: 100%;
    }

    .separator {
      background-color: #e0dede;
      border-radius: 3px;
      padding: 0 0.3em;
      font-size: 1.3em;
      font-weight: 600;
    }

    grid-auto-flow: column;
    /* grid-auto-columns: auto 20px auto; */
  }
`;

export const StyledTableProfile = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  justify-items: start;
  grid-template-areas: "photo title" "photo sub";
  align-items: center;
  align-content: center;
  .profile-photo {
    grid-area: photo;
    margin-right: 0.5em;
  }
  .profile-title {
    grid-area: title;
    font-weight: 600;
    letter-spacing: 0.3pt;
    word-spacing: 0.3pt;
  }

  .profile-subtitle {
    grid-area: sub;
    font-weight: 900;
    font-size: 0.75em;
    opacity: 0.6;
  }
`;

export const ChatBoxUi = styled.div`
  min-height: 100%;
  height: 100%;
  width: 100%;
  align-items: start;
  align-content: start;
  grid-auto-rows: auto calc(100% - 160px) auto;
  overflow-y: hidden;

  .cntr-title {
    max-height: 50px;
    min-height: 50px;
    height: 50px;
  }

  .sent-msg-ctnr {
    height: auto-fill;
    overflow-y: auto;
    max-height: 100%;
    max-height: -webkit-calc(100% - 160px);
    max-height: -moz-calc(100% - 160px);
    max-height: calc(100% - 160px);
    min-height: 100%;
    min-height: -webkit-calc(100% - 160px);
    min-height: -moz-calc(100% - 160px);
    min-height: calc(100% - 160px);
    background-color: #fff;

    .sent-msg-item {
      display: grid;
      padding: 0.7em;
      grid-template-areas: "img body" "img time";
      justify-content: start;
      justify-items: start;
      justify-content: start;

      .img {
        grid-area: img;
        margin-right: 0.5em;
        align-self: end;
      }

      .name-msg {
        grid-area: body;

        position: relative;
        background: #fff;
        border-radius: 20px;
        /* border: 0.01em solid rgba(0, 0, 0, 0.1); */
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        padding: 0.5em 1em;
        border-bottom-left-radius: 0;
        /* &:after {
            content: "";
            position: absolute;
            left: 1px;
            top: 90%;
            width: 0;
            height: 0;
            border: 15px solid transparent;
            border-right-color: #fafafa;
            border-left: 0;
            border-bottom: 0;
            margin-top: -7.5px;
            margin-left: -15px;
          } */

        .name {
          align-self: center;
          font-weight: 600;
          font-size: 0.7em;
          text-transform: capitalize;
          opacity: 0.7;
        }
        .message {
          padding-bottom: 0.3em;
          font-size: 0.75em;

          margin-top: 0.5em;
          align-self: start;
          font-weight: 400;
        }
      }

      .time {
        grid-area: time;
        font-size: 0.67em;
        justify-self: end;
        align-self: center;
        text-align: center;
        margin-top: 0.5em;
        padding: 0 0.3em;
      }
    }
  }

  .write-msg-ctnr {
    align-self: end;
    max-height: 100px;
    min-height: 100px;
    height: 100px;
    display: grid;
    align-self: center;
    align-items: center;
    align-content: center;
    grid-auto-columns: 1fr auto;
    grid-gap: 0.5em;
    grid-auto-flow: column;

    .MuiInputBase-root {
      border-radius: 30px !important;
      border-bottom: none !important;
      border: none !important;
      background-color: #fafafa;
    }
  }
`;

export const PageContainerUi = styled.div`
  display: grid;
  align-items: center;
  align-self: center;
  justify-items: center;
  max-width: 100%;
  overflow: hidden;
  .header-ctnr {
    display: grid;
    grid-template-areas: "logo name" "logo app" "title title";
    grid-auto-columns: auto 1fr;
    align-items: center;
    align-content: center;
    background-color: ${(p) => p.theme.palette.primary.main};
    color: ${(p) => p.theme.palette.primary.contrastText};
    padding: 0 0.5em;
    box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.2) !important;
    max-height: 65px;
    min-height: 65px;
    grid-gap: 0.3em;
    .brand-logo {
      grid-area: logo;
      margin-right: 0.2em;
    }
    .brand-name {
      grid-area: name;
      align-self: end;
      font-size: 0.87em !important;
      font-weight: 900;
    }
    .app-name {
      grid-area: app;
      align-self: start;
      font-weight: 600;
      font-size: 0.7em;
    }
  }

  .page-content {
    margin-top: 65px;
    padding: 1em;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.02) !important;
    background-color: #fff !important;
  }
`;

export const VideoChatUi = styled.div`
  display: grid;
  max-width: 100%;
  grid-gap: 1.5em;
  min-height: 600px;
  height: 80vh;

  /* xs up */
  @media all and (min-width: ${(props) =>
      props.theme.breakpoints.values.xs}px) {
    grid-template-areas: "video" "chat";
    grid-auto-columns: 1fr 1fr;
  }

  /* md up */
  @media all and (min-width: ${(props) =>
      props.theme.breakpoints.values.md}px) {
    grid-template-areas: "video chat";
    grid-auto-columns: 1fr 300px;
  }

  .container-video {
    grid-area: video;
    border-radius: 5px !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    overflow: hidden !important;
    background-color: #fff;
    height: 100%;
    min-height: 600px;
    height: 80vh;
    display: grid;
    grid-auto-rows: 1fr auto;

    .video {
      height: 100%;
    }

    .consult-info {
      padding: 1em;
    }
  }

  .container-chat {
    grid-area: chat;
    min-height: 600px;
    height: 600px;
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

    .cntr-title {
      max-height: 50px;
      min-height: 50px;
      height: 50px;
    }

    .sent-msg-ctnr {
      height: auto-fill;
      overflow-y: auto;
      max-height: 100%;
      max-height: -webkit-calc(100% - 150px);
      max-height: -moz-calc(100% - 150px);
      max-height: calc(100% - 150px);
      min-height: 100%;
      min-height: -webkit-calc(100% - 150px);
      min-height: -moz-calc(100% - 150px);
      min-height: calc(100% - 150px);
      background-color: #fff;

      .sent-msg-item {
        display: grid;
        padding: 0.7em;
        grid-template-areas: "img body" "img time";
        justify-content: start;
        justify-items: start;
        justify-content: start;

        .img {
          grid-area: img;
          margin-right: 0.5em;
          align-self: end;
        }

        .name-msg {
          grid-area: body;

          position: relative;
          background: #fff;
          border-radius: 20px;
          /* border: 0.01em solid rgba(0, 0, 0, 0.1); */
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          padding: 0.5em 1em;
          border-bottom-left-radius: 0;
          /* &:after {
            content: "";
            position: absolute;
            left: 1px;
            top: 90%;
            width: 0;
            height: 0;
            border: 15px solid transparent;
            border-right-color: #fafafa;
            border-left: 0;
            border-bottom: 0;
            margin-top: -7.5px;
            margin-left: -15px;
          } */

          .name {
            align-self: center;
            font-weight: 600;
            font-size: 0.7em;
            text-transform: capitalize;
            opacity: 0.7;
          }
          .message {
            padding-bottom: 0.3em;
            font-size: 0.75em;

            margin-top: 0.5em;
            align-self: start;
            font-weight: 400;
          }
        }

        .time {
          grid-area: time;
          font-size: 0.67em;
          justify-self: end;
          align-self: center;
          text-align: center;
          margin-top: 0.5em;
          padding: 0 0.3em;
        }
      }
    }

    .write-msg-ctnr {
      align-self: end;
      max-height: 100px;
      min-height: 100px;
      height: 100px;
      display: grid;
      align-self: center;
      align-items: center;
      align-content: center;
      grid-auto-columns: 1fr auto;
      grid-gap: 0.5em;
      grid-auto-flow: column;

      .MuiInputBase-root {
        border-radius: 30px !important;
        border-bottom: none !important;
        border: none !important;
        background-color: #fafafa;
      }
    }
  }
`;

export const UserProfileUi = styled(Container)`
  display: grid;
  grid-gap: 1.5em;
  max-width: 100%;
  align-content: start;
  align-items: start;

  @media all and (min-width: ${(props) =>
      props.theme.breakpoints.values.xs}px) {
    grid-template-areas: "actions" "profile" "notes" "tabs";
    /* grid-auto-columns: 1fr; */
    justify-content: start;
    justify-items: start;
  }

  @media all and (min-width: ${(props) =>
      props.theme.breakpoints.values.sm}px) {
    grid-template-areas: "actions actions" "profile notes" "tabs tabs";
    grid-auto-columns: 1fr;
    grid-auto-columns: 300px 1fr;
  }

  @media all and (min-width: ${(props) =>
      props.theme.breakpoints.values.md}px) {
    grid-template-areas: "actions actions" "profile tabs" "notes tabs";
    grid-auto-columns: 300px 1fr;
    grid-auto-rows: auto auto 1fr;
  }

  .actions {
    grid-area: actions;
    width: 100%;
  }
  .user-profile {
    grid-area: profile;
    display: grid;
    justify-items: center;
    align-content: start;
    align-items: start;
    grid-gap: 0.5em;
    .user-name {
      padding: 0.3em;
      font-size: 1em;
      font-weight: 900;
      text-align: center;
    }

    .personal-info-ctnr {
      margin-top: 0.5em;
      padding: 0 0.5em;
      display: grid;
      align-content: start;
      width: 100%;
      /* grid-gap: 0.5em; */
      .info-group-column {
        display: grid !important;
        padding: 0.5em 0;
        grid-auto-columns: 40% 60% !important;
      }
    }
  }

  .link-tabs {
    grid-area: tabs;
    overflow: hidden;
  }

  .doctor-notes {
    grid-area: notes;
    .content {
      margin-top: 1em;
      font-size: 0.83em;
      background-color: #fafafa;
      padding: 1em 0.5em;
    }
  }
`;
