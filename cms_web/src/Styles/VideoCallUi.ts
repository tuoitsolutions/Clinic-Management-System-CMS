import styled from "styled-components";

const VideoCallUi = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: 1fr auto;
  min-width: 100%;
  min-height: 100%;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  overflow: hidden;

  grid-gap: 0.5em;

  .consult-info {
    margin: 1em;
  }
`;

export default VideoCallUi;
