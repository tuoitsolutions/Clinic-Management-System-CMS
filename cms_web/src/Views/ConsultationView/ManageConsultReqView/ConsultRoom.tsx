import { Button, IconButton, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Jutsu } from "react-jutsu";
import { useDispatch, useSelector } from "react-redux";
import BodyLoader from "../../../Component/BodyLoader";
import { getAccessToken, SERVER_URL } from "../../../Helpers/AppConfig";
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
import ChatConsultApi from "../../../Services/Api/ChatConsultApi";
import ConsultReqChatEntity from "../../../Services/Entities/ConsultChatEntity";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import { RootStore } from "../../../Services/Store";
import { StyledConsultRoom } from "./styles";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import CustomAvatar from "../../../Component/CustomAvatar";
import { setPageSnackbar } from "../../../Services/Actions/PageActions";
import moment from "moment";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";

interface IConsultRoom {
  selected_row: ConsultRequestEntity;
}

const ConsultRoom: FC<IConsultRoom> = memo(({ selected_row }) => {
  const user = useSelector((store: RootStore) => store.UserReducer.user);
  const dispatch = useDispatch();
  const chat_form_ref = useRef<HTMLFormElement | null>();

  const [connection, set_connection] = useState(null);
  const message_textfield_ref = useRef<any>(null);

  const [chat_messages, set_chat_messages] = useState<
    Array<ConsultReqChatEntity>
  >([]);
  const [message_body, set_message_body] = useState("");

  const handleSetMessageBody = useCallback((e) => {
    set_message_body(e.target.value);
  }, []);

  const handleSubmitMessage = useCallback(async () => {
    const connection_id: string = connection.connectionId;

    if (!!connection_id) {
      const payload: ConsultReqChatEntity = {
        msg_body: message_body,
        consult_req_pk: selected_row.consult_req_pk,
        user_type: "hosp_resident",
        sender_name: user?.full_name,
        connection_id: connection_id,
      };

      const res = await ChatConsultApi.InsertConsultChat(payload);

      dispatch(
        setPageSnackbar(
          res?.message?.toString(),
          res.success ? "success" : "error"
        )
      );

      if (res.success) {
        set_message_body("");
      }
    }
  }, [connection, dispatch, message_body, selected_row, user]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      // .withUrl("https://localhost:44302/api/hubs/timer", {
      // .withUrl(`${SERVER_URL}api/hubs/ConsultChat`, {
      .withUrl(`${SERVER_URL}api/hubs/chat`, {
        accessTokenFactory: () => getAccessToken(),
        // skipNegotiation: true,
        // transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.None)
      .build();

    console.log(`newConnection`, newConnection);

    set_connection(newConnection);
  }, []);

  useEffect(() => {
    if (!!connection && !!selected_row?.consult_req_pk) {
      connection
        .start()
        .then((result) => {
          console.log(`result`, result);
          connection.on("GetConsultMessage", async () => {
            const res = await ChatConsultApi.GetConsultChat(
              selected_row.consult_req_pk
            );
            if (res.success) {
              set_chat_messages(res.data);
            } else {
              dispatch(setPageSnackbar(res?.message?.toString(), "error"));
            }
          });

          connection.on("connected", async () => {
            console.log(`connected`);
            const connection_id: string = connection.connectionId;
            if (!!connection_id) {
              const payload: ConsultReqChatEntity = {
                connection_id: connection_id,
                consult_req_pk: selected_row.consult_req_pk,
                user_type: "hosp_resident",
                sender_name: selected_row?.email,
              };
              await ChatConsultApi.JoinConsultChat(payload);
            }
          });
          connection.on("disconnected", async () => {
            const connection_id: string = connection.connectionId;
            if (!!connection_id) {
              const payload = {
                connection_id: connection_id,
                consult_req_pk: selected_row.consult_req_pk,
              };
              await ChatConsultApi.LeaveConsultChat(payload);
            }
          });
        })
        .catch((e) => console.error("Connection failed: ", e));
    }
  }, [connection, dispatch, selected_row]);

  useEffect(() => {
    let mounted = true;
    const fetch_initial_data = async () => {
      const res = await ChatConsultApi.GetConsultChat(
        selected_row.consult_req_pk
      );
      if (res.success) {
        set_chat_messages(res.data);
      } else {
        dispatch(setPageSnackbar(res?.message?.toString(), "error"));
      }
    };

    mounted && !!selected_row?.consult_req_pk && fetch_initial_data();

    return () => {
      mounted = false;
    };
  }, [dispatch, selected_row]);

  useEffect(() => {
    const connection_id: string = connection?.connectionId;
    if (!!chat_messages && !!connection_id && message_textfield_ref?.current) {
      message_textfield_ref?.current.scrollIntoView(false);
    }
  }, [chat_messages, connection]);

  return (
    !!user?.full_name && (
      <>
        <StyledConsultRoom>
          {!!!!selected_row?.consult_link_hash && (
            <div className="video-ctnr">
              <Jutsu
                roomName={
                  selected_row.hash_key + selected_row.consult_link_hash
                }
                displayName={user?.full_name}
                subject={selected_row.consult_req_pk}
                containerStyles={{
                  height: `100%`,
                  width: `100%`,
                  border: `none`,
                }}
                loadingComponent={<BodyLoader />}
                errorComponent={
                  <Alert severity="error">The video could not be loaded.</Alert>
                }
                configOverwrite={{
                  enableWelcomePage: false,
                  prejoinPageEnabled: false,
                  disableLogCollector: true,
                  defaultLogLevel: "error",
                  startWithVideoMuted: true,
                  startWithAudioMuted: true,
                }}
                onJitsi={(e) => {
                  console.log(`jitsi details -> `, e);
                }}
                loggerConfigOverwrite={{
                  disableLogCollector: true,
                }}
                interfaceConfigOverwrite={{
                  disableLogCollector: true,
                  defaultLogLevel: "error",
                  prejoinPageEnabled: false,
                  DISPLAY_WELCOME_FOOTER: false,
                  GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
                  HIDE_INVITE_MORE_HEADER: true,
                  HIDE_DEEP_LINKING_LOGO: true,
                  SHOW_JITSI_WATERMARK: false,
                  SHOW_WATERMARK_FOR_GUESTS: false,
                  // JITSI_WATERMARK_LINK: "",
                  TOOLBAR_BUTTONS: [
                    "microphone",
                    "camera",
                    "desktop",
                    "fullscreen",
                    "fodeviceselection",
                    "hangup",
                    "profile",
                    "etherpad",
                    "settings",
                    "raisehand",
                    "stats",
                    "shortcuts",
                    "tileview",
                    "videobackgroundblur",
                    "mute-everyone",
                  ],
                }}
              />
            </div>
          )}
          {!!connection?.connectionId && (
            <div className="chat-ctnr">
              <div className="cntr-title">
                <div className="main">Chat</div>
                <div className="sub">
                  You can communicate with each other here.
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
                <form
                  id="hook-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitMessage();
                  }}
                  className="write-msg-ctnr"
                  ref={chat_form_ref}
                >
                  <TextField
                    value={message_body}
                    onChange={handleSetMessageBody}
                    fullWidth
                    variant="outlined"
                    placeholder="Write your message here..."
                    multiline
                    rowsMax={2}
                    rows={2}
                    className="write-btn"
                    onKeyDown={(
                      event: React.KeyboardEvent<HTMLDivElement>
                    ): void => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        if (chat_form_ref.current) {
                          handleSubmitMessage();
                        }
                      }
                    }}
                    InputProps={{
                      style: {
                        backgroundColor: `#f1f3f8`,
                      },
                    }}
                  />
                  <IconButton form="hook-form" type="submit" color="primary">
                    <SendRoundedIcon />
                  </IconButton>
                </form>
              </div>
            </div>
          )}
        </StyledConsultRoom>
      </>
    )
  );
});

export default ConsultRoom;
