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
