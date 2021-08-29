import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledPaymentView = styled(Container)`
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
  .pay-title-ctnr {
    .pay-title {
      .main {
        font-weight: 500;
        font-size: 1.5em;
      }
      .sub-title {
        font-size: 0.87em;
        opacity: 0.8;
      }
    }
  }
  .pay-body-ctnr {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr 400px;
    margin-top: 2em;
    grid-gap: 1em;
    grid-template-areas: "pay soa";

    @media (max-width: 768px) {
      /* grid-auto-columns: 1fr 400px; */
      grid-template-areas: "pay" "soa";
    }

    .body-title {
      font-weight: 500;
      font-size: 1.2em;
      margin: 1em 0;
    }
    .pay-method-ctnr {
      grid-area: pay;
    }
    .pay-soa {
      grid-area: soa;
      .pay-soa-content {
        padding: 1em;
        background-color: #fafafa;
        border-radius: 5px;
        .soa-info-group {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: auto 1fr;
          justify-content: start;
          justify-items: start;
          align-content: center;
          align-items: center;
          grid-gap: 1em;
          padding: 0.7em 0;
          box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.1);
          .soa-label {
            opacity: 0.7;
            font-size: 0.9em;
          }
          .soa-value {
            font-weight: 500;
            text-align: end;
            justify-self: end;
          }
        }
      }
    }
  }
`;
