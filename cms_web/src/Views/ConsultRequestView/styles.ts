import { Container } from "@material-ui/core";
import styled from "styled-components";

export const ConsultRequestUi = styled(Container)`
  padding: ${(p) => p.theme.spacing(3)}px !important;
  padding-top: ${(p) => p.theme.spacing(1)}px !important;

  min-height: 90vh !important;
`;
