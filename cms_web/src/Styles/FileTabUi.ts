import styled from "styled-components";

const FileTabUi = styled.div`
  display: grid !important;
  height: 100%;
  min-height: 100%;
  border-radius: 5px;
  min-width: 100%;
  overflow: hidden;
  align-items: start;
  align-content: start;
  grid-auto-rows: auto 1fr;

  .ctnr-title {
    padding: 0.5em;
  }

  .file-contents {
    all: unset;
    overflow-y: auto;
    max-height: 100%;
    min-height: 100%;
    display: grid;
    grid-gap: 1em;
    margin: 5px 0;
    align-content: start;
    align-items: start;
    max-width: 100%;
    background-color: #fff;

    .file-item {
      /* background-color: #fafafa; */
      border-radius: 7px;
      cursor: pointer;
      padding: 0.5em;
      box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.2);
      margin: 0 0.5em;
      &:hover {
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
        transition: 0.2s box-shadow ease-in-out;
      }

      .file-name {
        font-weight: 500;
        font-size: 0.8em;
        color: #775ada;
        font-weight: 700;
        white-space: pre-wrap;
        word-break: break-all;
      }
      .file-ts {
        margin-top: 5px;
        font-size: 0.6em;
        letter-spacing: 0.3pt;
        word-spacing: 0.3pt;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.75);
      }
    }
  }
`;

export default FileTabUi;
