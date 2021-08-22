import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledConsultRequestView = styled(Container)`
  min-height: 100vh;
  background-color: #fff;
  padding: 1em;
  /* margin: 1em; */
  /* border-radius: 7px; */
  overflow: hidden;
  /* background-color: red !important; */

  .header-ctnr {
    display: grid;
    grid-template-areas: "logo name" "logo app" "title title";
    grid-auto-columns: auto 1fr;
    align-items: center;
    align-content: center;
    background-color: ${(p) => p.theme.palette.primary.main};
    color: ${(p) => p.theme.palette.primary.contrastText};
    margin: -1em;
    padding: 0.5em 1em;
    margin-bottom: 0.5em;

    /* grid-gap: 0.3em; */
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

  .tabs-ctnr {
    padding: 0 1.5em;
  }

  .actions {
    /* padding: 1em; */
    padding-top: 2em;
    display: grid;
    justify-content: end;
    justify-items: end;
    align-items: center;
    align-content: center;
    grid-gap: 0.5em;
    grid-auto-flow: column;
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
    padding: 1.5em 1em;
  }
`;
