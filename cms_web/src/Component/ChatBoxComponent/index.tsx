import { IconButton } from "@material-ui/core";
import React, { memo, FC, useEffect, useRef } from "react";
import CustomAvatar from "../CustomAvatar";
import SendRoundedIcon from "@material-ui/icons/SendRounded";

import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import styled from "styled-components";
import { useTheme } from "@material-ui/styles";
import ChatModel from "../../Services/Models/ChatModel";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../Services/Store";
import ChatActions from "../../Services/Actions/ChatActions";
import { DateSqlToNow } from "../../Hooks/UseDateParser";

interface IChatBoxComponent {
  chat_box: ChatModel;
  index: number;
}

const ChatBoxComponent: FC<IChatBoxComponent> = memo(({ chat_box, index }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const message_textfield_ref = useRef(null);

  const chat_boxes = useSelector(
    (store: RootStore) => store.ChatReducer.chat_boxes
  );

  const HandleRemoveChatBox = useCallback(() => {
    chat_boxes.splice(index, 1);

    dispatch(ChatActions.SetChatBoxes([...chat_boxes]));
  }, [chat_boxes, dispatch, index]);

  useEffect(() => {
    message_textfield_ref?.current.scrollIntoView(false);
  }, []);

  return (
    <>
      <ChatBoxComponentUi theme={theme}>
        <div className="chat-user">
          <div className="user-fullname">{chat_box.chat_name}</div>
          <div className="actions">
            <IconButton
              size="small"
              onClick={() => {
                HandleRemoveChatBox();
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </div>
        </div>
        <div className="chat-msg">
          {chat_box?.messages.map((r, i) => (
            <div className="msg-item" key={i}>
              {/* <CustomAvatar spacing={4} alt="Y" src="" /> */}
              {r.send_img}
              <div className="name-msg">
                <div className="name">{r.sender_name}</div>
                <div className="message">{r?.sender_message}</div>
              </div>
              <div className="time">{DateSqlToNow(r.sender_time, "-")}</div>
            </div>
          ))}
          <div ref={message_textfield_ref} />
        </div>
        <div className="chat-compose">
          <textarea placeholder="Type your message" />

          <IconButton
            size="small"
            onClick={() => {
              chat_box.handleSendMessage();
            }}
          >
            <SendRoundedIcon color="primary" />
          </IconButton>
        </div>
      </ChatBoxComponentUi>
    </>
  );
});

export default ChatBoxComponent;

const ChatBoxComponentUi = styled.div`
  display: grid !important;
  background-color: #fff !important;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
  overflow: hidden;
  height: auto;
  min-width: 300px;
  .chat-user {
    display: grid;
    align-items: center;
    align-content: center;
    min-height: 35px !important;
    height: 35px !important;
    background-color: ${(p) => p.theme.palette.primary.main} !important;
    color: ${(p) => p.theme.palette.primary.contrastText} !important;
    padding: 5px 1em;

    grid-auto-flow: column;
    grid-gap: 1em;
    grid-auto-columns: 1fr auto;

    .user-fullname {
      font-size: 0.8em;
      font-weight: 500;
    }
    .actions {
      display: grid;
      grid-auto-flow: column;
      align-items: center;
      align-content: center;
      span {
        color: ${(p) => p.theme.palette.primary.contrastText}!important;
      }
    }
  }
  .chat-msg {
    min-height: 250px !important;
    height: 250px !important;
    overflow-y: auto;

    .msg-item {
      display: grid;
      padding: 0.7em;
      grid-template-areas: "img body" "img time";
      justify-content: start;
      justify-items: start;
      justify-content: start;

      .img {
        grid-area: img;
        margin-right: 0.5em;
        align-self: end;
      }

      .name-msg {
        grid-area: body;

        position: relative;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        padding: 0.5em 1em;
        border-bottom-left-radius: 0;

        .name {
          align-self: center;
          font-weight: 600;
          font-size: 0.7em;
          text-transform: capitalize;
          opacity: 0.7;
        }
        .message {
          padding-bottom: 0.3em;
          font-size: 0.75em;

          margin-top: 0.5em;
          align-self: start;
          font-weight: 400;
        }
      }

      .time {
        grid-area: time;
        font-size: 0.67em;
        justify-self: end;
        align-self: center;
        text-align: center;
        margin-top: 0.5em;
        padding: 0 0.3em;
      }
    }
  }
  .chat-compose {
    background-color: #fafafa;
    padding: 0.5em;
    display: grid;
    grid-auto-flow: column;
    grid-gap: 0.5em;
    grid-auto-columns: 1fr auto;

    textarea {
      border: none;
      height: auto;
      padding: 1em;
      width: 100%;
      border-radius: 35px;
      resize: none;
    }
    .MuiInputBase-input {
      border: none !important;
    }
  }
`;
