import { Container } from "@material-ui/core";
import styled from "styled-components";

export const DashboardUi = styled(Container)`
  .container {
    padding: 1em;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.01);
  }

  .stats-item {
    border-radius: 7px;
    background-color: #fff !important;
    padding: 1em;
    max-height: 100px;
    min-height: 100px;
    min-width: 180px;
    text-align: center;
    display: grid;
    align-items: center;
    align-content: center;
    justify-items: center;
    justify-content: center;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  }

  .stats-item .value {
    font-size: 1.8em;
    font-weight: 900;
  }

  .stats-item .label {
    font-size: 0.8em;
    opacity: 0.55;
    font-weight: 800;
  }

  .table-dashboard {
    /* font-size: 0.87em !important; */
  }
`;
