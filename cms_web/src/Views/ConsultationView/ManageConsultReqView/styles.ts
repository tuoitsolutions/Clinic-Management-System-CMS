import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledConsultRoom = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr 300px;
  grid-gap: 1em;

  .video-ctnr {
    border-radius: 5px !important;
    min-height: 380px;
    overflow: hidden !important;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
  .chat-ctnr {
    width: 100%;
    padding: 0.5em;
    border-radius: 5px !important;
    /* background-color: #fafafa; */

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
        max-height: 350px;
        min-height: 350px;
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

    /* } */
  }
`;

export const PatientManageUi = styled(Container)`
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
  .patient-profile {
    grid-area: profile;
    display: grid;
    justify-items: center;
    align-content: start;
    align-items: start;
    /* grid-gap: 0.3em; */
    .patient-profile-title {
      padding: 0.5em 0.3em;
      text-align: center;

      .main {
        all: none;
        font-size: 1em;
        font-weight: 900;
      }
      .sub {
        all: none;
        font-size: 0.7em;
        color: rgba(0, 0, 0, 0.5);
        font-weight: 900;
        margin-bottom: 0.2em;
      }
    }

    .personal-info-ctnr {
      margin-top: 1em;
      padding: 0 0.5em;
      display: grid;
      align-content: start;
      width: 100%;
      /* grid-gap: 0.5em; */
      .info-group-column {
        display: grid;
        padding: 5px 0;
        grid-auto-columns: 2fr 3fr;
        box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.2) !important;
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
