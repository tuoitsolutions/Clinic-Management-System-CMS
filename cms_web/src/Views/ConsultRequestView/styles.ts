import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledConsultRequestView = styled(Container)`
  min-height: 100vh;
  background-color: #fff;
  padding: 1em;
  /* border-radius: 5px; */
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.02) !important;

  .header-ctnr {
    display: grid;
    grid-template-areas: "logo name" "logo app" "title title";
    grid-auto-columns: auto 1fr;
    align-items: center;
    align-content: center;
    background-color: ${(p) => p.theme.palette.primary.main};
    color: ${(p) => p.theme.palette.primary.contrastText};
    margin: -1em;
    padding: 1em;
    margin-bottom: 0.5em;
    box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.2) !important;

    /* grid-gap: 0.3em; */
    .brand-logo {
      grid-area: logo;
      margin-right: 1em;
    }
    .brand-name {
      grid-area: name;
      align-self: end;
      font-size: 1.2em;
      font-weight: 900;
    }
    .app-name {
      grid-area: app;
      align-self: start;
      font-weight: 900;
      font-size: 0.9em;
      opacity: 0.9;
      letter-spacing: 0.3pt;
      word-spacing: 0.3pt;
    }
  }

  .main-title {
    padding: 0.5em 1em;
    /* font-weight: 600;
    font-size: 1em; */
  }

  .tabs-ctnr {
    padding: 0 1.5em;
  }

  .actions {
    /* padding: 1em; */
    padding-top: 2em;
    /* display: grid;
    justify-content: end;
    justify-items: end;
    align-items: center;
    align-content: center;
    grid-gap: 1.5em;
    grid-auto-flow: column; */
  }

  .summary-footer {
    display: grid;
    justify-content: end;
    justify-items: end;
    align-items: center;
    align-content: center;
  }

  .summary-footer-item {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 0.5em;
    align-items: center;
    align-content: center;
    padding: 0.35em;
    grid-gap: 1em;
    font-size: 0.93em;
    grid-auto-columns: 150px 200px;

    .label {
      font-weight: 400;
    }
    .value {
      font-weight: 700;
      border-bottom: 0.01em solid rgba(0, 0, 0, 0.2);
      text-align: right;
      text-align: end;
    }
  }

  .tab-container {
    padding: 1em;
  }
`;
