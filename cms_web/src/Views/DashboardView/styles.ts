import { Container } from "@material-ui/core";
import styled from "styled-components";

export const DashboardUi = styled(Container)`
  .container {
    padding: 1em;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
    height: 100%;
  }

  .stats-container {
    grid-template-areas: "cards" "chart" "table";
    grid-gap: 2em;
    display: grid;
    margin-top: 1em;

    @media all and (min-width: ${(props) =>
        props.theme.breakpoints.values.md}px) {
      grid-template-areas: "cards chart " "table chart";
      grid-auto-columns: 1fr 250px;
      max-width: 100% !important;
    }

    .stats-card-container {
      grid-area: cards;
      display: grid;
      grid-gap: 1.5em;
      justify-content: center;
      justify-items: center;
      grid-template-columns: 1fr;

      @media all and (min-width: ${(props) =>
          props.theme.breakpoints.values.xs}px) {
        grid-template-columns: 1fr;
      }
      @media all and (min-width: ${(props) =>
          props.theme.breakpoints.values.sm}px) {
        grid-template-columns: 1fr 1fr;
      }
      @media all and (min-width: ${(props) =>
          props.theme.breakpoints.values.lg}px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }
      .stats-item {
        border-radius: 10px;
        background-color: #fff !important;
        max-height: 110px;
        min-height: 110px;
        height: 100%;
        /* min-width: 300px; */
        width: 100%;
        display: grid;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;

        grid-auto-columns: 1fr auto;
        grid-template-areas: "value icon" "label icon" "color color";
        padding: 0.5em 1em;
        padding-top: 1.8;
        align-content: center;
        grid-auto-rows: auto auto 1fr;
      }

      .stats-item .stats-value {
        grid-area: value;
        font-weight: 900;
        font-size: 2.3em;
        padding: 0;
        margin-left: 0.2em;
      }

      .stats-item .stats-label {
        grid-area: label;
        font-size: 0.78em;
        color: rgba(0, 0, 0, 0.65);
        font-weight: 700;
        margin-left: 0.5em;
      }

      .stats-item .stats-icon {
        grid-area: icon;
        justify-self: end;
        align-self: center;
        margin-right: 0.5em;
        /* font-size: 0.8em;
    opacity: 0.55;
    font-weight: 800; */
      }

      .stats-item .stats-color {
        padding-top: 5px;
        grid-area: color;
        min-height: 5px;
        min-width: 100%;
        height: 5px;
        border-radius: 5px;
        align-self: end;
      }
    }

    .stats-table-container {
      grid-area: table;
      max-width: 100% !important;
      overflow: hidden !important;
      background-color: #fff;
    }

    .stats-chart-container {
      grid-area: chart;
      max-width: 100%;
      height: 100%;
      display: grid;
      justify-content: center;
      justify-items: center;
      align-content: center;
      align-items: center;
      background-color: #fff;
    }
  }

  .table-dashboard {
  }
`;
