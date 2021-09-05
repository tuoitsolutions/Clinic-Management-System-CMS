import styled from "styled-components";

export const StyledUserProfile = styled.div`
  margin-left: 1em;
  .header {
    display: grid;
    grid-auto-flow: column;
    grid-template-areas: "image icon user";
    align-items: center;
    align-content: center;

    &:hover {
      cursor: pointer;

      .profile-image,
      .icon {
        transition: 0.3s all ease-in-out;
      }
    }
    .profile-image {
      grid-area: image;
      /* box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05); */
    }

    .icon {
      justify-self: start;
      grid-area: icon;
      color: #fff;
    }
    .user {
      all: unset;
      grid-area: user;
      max-width: 120px;
      width: 120px;

      .fullname {
        font-size: 0.87em;
        font-weight: 900;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #fff;
        text-transform: capitalize;
      }
      .designation {
        font-size: 0.6em !important;
        font-weight: 700 !important;
        color: #fff !important;
        opacity: 7 !important;
        letter-spacing: 0.3pt !important;
        word-spacing: 0.3pt !important;
        text-transform: capitalize !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .MuiPopover-root {
    background-color: red !important;
    & > .content-header {
      background-color: red !important;
      color: red;
    }
    &.content-header {
      background-color: red !important;
      color: red;
    }

    .content-header {
      background-color: red !important;
      color: red;
    }
  }
`;

export const StyledPopOverContent = styled.div`
  width: 250px;
  min-width: 250px;
  .content-header {
    overflow: hidden;
    display: grid;
    grid-auto-flow: column;
    align-content: center;
    justify-content: start;
    align-items: center;
    justify-items: start;
    grid-gap: 0.5em;
    padding: 1em;
    grid-auto-columns: auto 1fr 100px;
    background-color: #f5f5f5;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.1);

    .content-header-image {
      height: 50px;
      width: 50px;
    }
    .content-header-user {
      text-transform: capitalize;

      .name {
        font-weight: 900;
      }

      .designation {
        opacity: 0.7;
        font-size: 0.7em;
        font-weight: 900;
        letter-spacing: 0.3pt;
        word-spacing: 0.3pt;
      }
    }

    .btn-logout {
      color: #fff;
    }
  }

  .content-body {
    padding: 1em;

    .content-title {
      font-weight: 900;
      color: black;
      opacity: 0.6;
      font-size: 0.9em;
    }
    .content-items {
      margin-top: 0.5em;
      display: grid;
      grid-gap: 0.5em;
    }
    .link {
      padding: 0.2em 0.3em;
      box-shadow: 0 3px 2px -2px rgba(0, 0, 0, 0.1) !important;
      color: #333 !important;
      &:hover {
        color: blue !important;
      }
    }
  }
`;
