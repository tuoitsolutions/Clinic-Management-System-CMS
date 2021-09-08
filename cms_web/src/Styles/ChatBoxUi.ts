import styled from "styled-components";

const ChatBoxUi = styled.div`
  display: grid !important;
  height: 100%;
  min-height: 100%;
  border-radius: 5px;
  overflow: hidden;
  min-width: 100%;
  align-items: start;
  align-content: start;
  grid-auto-rows: auto 1fr auto;

  .ctnr-title {
    padding: 0.5em;
  }

  .chat-msg {
    /* height: 250px !important; */
    overflow-y: auto;
    max-height: 100%;

    .msg-item {
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
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        padding: 0.5em 1em;
        border-bottom-left-radius: 0;

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
          white-space: pre-wrap;
          word-break: break-all;
        }

        &.file-message {
          background-color: #f5f5f5;
          &:hover {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
            transition: 0.2s box-shadow ease-in-out;
          }

          .message {
            font-weight: 700;
            white-space: pre-wrap;
            word-break: break-all;
            color: #775ada;
            cursor: pointer;
          }
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
  .chat-actions {
    display: grid;

    .chat-files {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr auto;
      align-items: center;
      align-content: center;
      /* max-height: 50px; */
      padding: 0.5em;
      grid-gap: 1em;

      width: 100%;
      max-width: 100%;
      .file-attach-ctnr {
        /* display: grid;
        justify-content: start;
        justify-items: start;
        grid-template-columns: repeat(auto-fill, 300px);
        grid-gap: 10px; */

        .file-attach-item {
          background-color: #f5f5f5;
          border-radius: 8px;
          /* max-width: 80px; */

          margin: 5px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0, 1);

          display: grid;

          justify-content: center;
          justify-items: center;
          align-content: center;
          align-items: center;
          padding: 5px;
          grid-auto-columns: 1fr auto;
          grid-gap: 3px;

          grid-auto-flow: column;
          .file-name {
            text-align: center;
            font-weight: 600;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            width: 100%;
            font-size: 0.5em;
          }
          .file-btn {
            font-size: 0.8em;
          }
        }
      }
    }

    .chat-compose {
      background-color: #fafafa;
      padding: 0.5em;
      display: grid;
      grid-auto-flow: column;
      grid-gap: 0.5em;
      grid-auto-columns: 1fr auto;
      align-content: center;
      align-items: center;
      textarea {
        border: none;
        height: auto;
        padding: 1em;
        width: 100%;
        border-radius: 35px;
        resize: none;
      }
      .MuiInputBase-input {
        border: none !important;
      }
    }
  }
`;

export default ChatBoxUi;
