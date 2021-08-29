import { Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import BoxLoader from "../../../Assets/loaders/BoxLoader";
import CustomAvatar from "../../../Component/CustomAvatar";
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
import ChatConsultApi from "../../../Services/Api/ChatConsultApi";
import ConsultReqChatEntity from "../../../Services/Entities/ConsultChatEntity";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import { ChatBoxUi } from "../../../Styles/GlobalStyles";

interface ITabChatHistoryRecord {
  selected_row: ConsultRequestEntity;
}

const TabChatHistoryRecord: FC<ITabChatHistoryRecord> = memo(
  ({ selected_row }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const message_textfield_ref = useRef<any>(null);

    const [chat_messages, set_chat_messages] = useState<
      Array<ConsultReqChatEntity>
    >([]);
    const [fetch_chat_messages, set_fetch_chat_messages] =
      useState<boolean>(false);
    const [reload_chat_messages, set_reload_chat_messages] = useState(0);
    const [page_err_msg, set_page_err_msg] = useState("");

    useEffect(() => {
      let mounted = true;
      const fetchTableData = async () => {
        mounted && set_fetch_chat_messages(true);
        const table_response = await ChatConsultApi.GetConsultChat(
          selected_row.consult_req_pk
        );

        if (table_response.success) {
          mounted && set_chat_messages(table_response.data);
        } else {
          mounted && set_page_err_msg(table_response.message?.toString());
        }
        mounted && set_fetch_chat_messages(false);
      };

      mounted && !!selected_row?.consult_req_pk && fetchTableData();

      return () => {
        mounted = false;
      };
    }, [reload_chat_messages, selected_row]);

    useEffect(() => {
      if (!!chat_messages && message_textfield_ref?.current) {
        message_textfield_ref?.current.scrollIntoView(false);
      }
    }, [chat_messages]);

    return (
      <>
        <Grid container spacing={6} justify="center">
          {!!page_err_msg ? (
            <Alert severity="error">{page_err_msg}</Alert>
          ) : !!chat_messages ? (
            <>
              <ChatBoxUi style={{ width: 500 }}>
                <div className="cntr-title">
                  <div className="main">Chat</div>
                  <div className="sub">
                    Chat history during the consultation
                  </div>
                </div>

                <div className="chat-content">
                  <div className="sent-msg-ctnr" id="msg-ctnr">
                    {chat_messages.map((msg, i) => (
                      <div
                        key={i}
                        // ref={}
                        className="sent-msg-item"
                      >
                        <CustomAvatar
                          className="img"
                          src=""
                          alt={msg.sender_name.charAt(1)}
                          spacing={7}
                          // src={msg.picture}
                        />
                        <div className="name">{msg.sender_name}</div>
                        <div className="time">
                          {InvalidDateTimeToDefault(msg.sent_at, "-")}
                        </div>
                        <div className="message">{msg.msg_body}</div>
                      </div>
                    ))}
                    <div ref={message_textfield_ref} />
                  </div>
                </div>
              </ChatBoxUi>
            </>
          ) : (
            <div className="centered-item">
              <BoxLoader />
            </div>
          )}
        </Grid>
      </>
    );
  }
);

export default TabChatHistoryRecord;
