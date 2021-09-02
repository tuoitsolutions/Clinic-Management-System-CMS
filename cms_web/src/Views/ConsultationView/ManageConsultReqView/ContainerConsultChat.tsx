import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatActions from "../../../Services/Actions/ChatActions";
import ChatConsultApi from "../../../Services/Api/ChatConsultApi";
import ConsultReqChatEntity from "../../../Services/Entities/ConsultChatEntity";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import ChatModel, { ChatMessage } from "../../../Services/Models/ChatModel";
import { RootStore } from "../../../Services/Store";
import ChatRoundedIcon from "@material-ui/icons/ChatRounded";
import { IconButton } from "@material-ui/core";
import { FC } from "react";
import CustomAvatar from "../../../Component/CustomAvatar";

interface IContainerConsultChat {
  selected_row?: ConsultRequestEntity;
  is_open?: boolean;
}

const ContainerConsultChat: FC<IContainerConsultChat> = memo(
  ({ selected_row }) => {
    const dispatch = useDispatch();

    const chat_boxes = useSelector(
      (store: RootStore) => store.ChatReducer.chat_boxes
    );

    const [chat_messages, set_chat_messages] = useState<
      Array<ConsultReqChatEntity>
    >([]);
    useState<boolean>(false);
    const [reload_chat_messages, set_reload_chat_messages] = useState(0);
    const [is_open_chat, set_is_open_chat] = useState(0);

    useEffect(() => {
      let mounted = true;
      const fetchTableData = async () => {
        const table_response = await ChatConsultApi.GetConsultChat(
          selected_row.consult_req_pk
        );

        if (table_response.success) {
          const chats: Array<ConsultReqChatEntity> = table_response.data;
          mounted && set_chat_messages(chats);

          const messages: Array<ChatMessage> = [];

          chats.forEach((c) => {
            messages.push({
              send_img: (
                <CustomAvatar
                  src=""
                  className="img"
                  alt={c?.sender_name?.charAt(0)}
                  spacing={4}
                />
              ),
              sender_message: c?.msg_body,
              sender_name: c?.sender_name,
              sender_time: c?.sent_at,
            });
          });

          const chatBox: ChatModel = {
            chat_id: selected_row?.hash_key,
            chat_name: `${selected_row?.first_name} ${selected_row?.last_name} (${selected_row?.consult_req_pk})`,
            handleSendMessage: () => {},
            messages: messages,
          };

          const found_index = chat_boxes.findIndex(
            (c) => c.chat_id === chatBox.chat_id
          );

          if (found_index === -1) {
            dispatch(ChatActions.SetChatBoxes([chatBox, ...chat_boxes]));
          }
        }
      };

      mounted &&
        is_open_chat > 0 &&
        !!selected_row?.consult_req_pk &&
        fetchTableData();

      return () => {
        mounted = false;
      };
    }, [dispatch, is_open_chat, reload_chat_messages, selected_row]);

    useEffect(() => {
      return () => {
        const found_index = chat_boxes.findIndex(
          (c) => c.chat_id === selected_row?.hash_key
        );

        console.log(`chat_boxes unmount`, chat_boxes);

        if (found_index !== -1) {
          chat_boxes.splice(found_index, 1);
          dispatch(ChatActions.SetChatBoxes([...chat_boxes]));
        }
      };
    }, [chat_boxes, dispatch, selected_row]);

    return (
      <IconButton
        color="primary"
        onClick={() => {
          set_is_open_chat((o) => o + 1);
        }}
      >
        <ChatRoundedIcon />
      </IconButton>
    );
  }
);

export default ContainerConsultChat;
