import styled from "styled-components";

export const StyledTableData = styled.div`
  /* display: grid; */
  grid-gap: 1em;
  align-content: start;
  align-items: start;
  justify-items: start;

  @media all and (min-width: ${(props) =>
      props.theme.breakpoints.values.xs}px) {
    grid-auto-flow: row;
    grid-auto-columns: auto;
  }

  @media all and (min-width: ${(props) =>
      props.theme.breakpoints.values.md}px) {
    /* grid-auto-columns: 250px 100%; */
    grid-auto-flow: column;
  }

  .table-grid {
    .table-ctnr {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
  }
`;

export const StyledBox = styled.div`
  .box-title {
    padding: 0.5em 0;
    border-bottom: 4px solid rgba(0, 0, 0, 0.1);
    font-size: 0.9em;
    font-weight: 600;
  }

  .box-body {
    margin: 0.5em 0;
  }
`;

export const StyledMedContainer = styled.div`
  .content {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr));

    .med-item {
      padding: 1em;
      box-shadow: 0 2px 3px #b3e5fc;
      border-radius: 7px;
      letter-spacing: 0.3pt;
      word-spacing: 0.3pt;
      display: grid;
      grid-gap: 0.2em;

      .title {
        font-weight: 900;
      }
      .subtitle {
        font-weight: 600;
        font-size: 0.87em;
      }

      .details {
        font-weight: 600;
        font-size: 0.8em;
        opacity: 0.8;
      }
    }
  }
`;

export const StyledTextFieldRange = styled.div`
  border: 0.03em solid rgba(0, 0, 0, 0.2);
  /* width: 100%; ${(props) => props.theme.palette.primary.light} */
  border-radius: 5px;
  display: grid;
  align-items: center;
  height: 55px;
  &:hover {
    border: 1px solid ${(props) => props.theme.palette.primary.main};
  }
  label {
    margin-top: -5px;
    /* margin-left: -10px; */
    padding: 0 0.5em;
    background-color: #fff;
    justify-self: start;
    transform: translate(-6px, -6px) scale(0.75);
  }

  .input-group {
    display: grid;
    margin-bottom: 25px !important;
    margin-left: 10px;
    margin-right: 10px;
    grid-gap: 2px;
    input {
      width: auto;
      border: none;
      height: 100%;
      font-size: 1.1em;
      /* border-bottom: 1px solid black; */
      width: 100%;
    }

    .separator {
      background-color: #e0dede;
      border-radius: 3px;
      padding: 0 0.3em;
      font-size: 1.3em;
      font-weight: 600;
    }

    grid-auto-flow: column;
    /* grid-auto-columns: auto 20px auto; */
  }
`;

export const StyledTableProfile = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  justify-items: start;
  grid-template-areas: "photo title" "photo sub";
  .profile-photo {
    grid-area: photo;
    margin-right: 7px;
  }
  .profile-title {
    grid-area: title;
    font-weight: 500;
  }

  .profile-subtitle {
    grid-area: sub;
    font-weight: 400;
    font-size: 0.9em;
    opacity: 0.9;
  }
`;
