import styled from "styled-components";

export const StyledOnlineUsersMenu = styled.div`
  .icon-header {
    color: #fff;
  }
`;

export const StyledOnlineUsersMenuPopOver = styled.div`
  width: 360px;

  .content-header {
    overflow: hidden;
    background-color: ${(p) => p.theme.header.backgroundColor};
    color: ${(p) => p.theme.header.color};
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
    padding: 1em;
    display: grid;
    grid-auto-columns: 1fr 1fr;
    grid-auto-flow: column;

    .info {
      text-align: center;
      display: grid;
      align-content: center;
      justify-content: center;
      align-items: center;
      justify-items: center;
      grid-gap: 0.5em;

      .value {
        font-size: 1.5em;
        font-weight: 600;
      }
      .title {
        font-size: 0.9;
        font-weight: 600;
      }
    }
    .btn {
      display: grid;
      justify-content: end;
      align-items: center;
      align-content: center;
    }
  }

  .content-body {
    padding: 1.5em;
    padding-top: 1em;
    font-size: 0.87em;

    max-height: 500px;
    overflow-y: auto;

    .online-user {
      display: grid;
      grid-template-areas: "img name" "img group";
      padding: 0.5em;
      grid-auto-columns: auto 1fr;
      align-items: center;
      align-content: center;
      .img {
        grid-area: img;
        height: 30;
        width: 30;
        margin-right: 0.4em;
        background-color: ${(p) => p.theme.palette.secondary.main};
        color: ${(p) => p.theme.palette.secondary.contrastText};
        font-size: 1em;
        font-weight: 900;
      }
      .name {
        grid-area: name;
        font-size: 0.93em;
        font-weight: 700;
      }
      .group {
        grid-area: group;
        font-size: 0.84em;
        opacity: 0.8;
      }
    }
    .content-items {
      margin-top: 0.5em;
      display: grid;
      grid-gap: 0.5em;
    }
    .link {
      padding: 0.5em 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      color: rgba(0, 0, 0, 0.6);
      &:hover {
        color: blue;
      }
    }
  }
`;
