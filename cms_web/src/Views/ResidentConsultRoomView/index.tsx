import {
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  useTheme,
} from "@material-ui/core";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
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
import { useParams } from "react-router-dom";
import BodyLoader from "../../Component/BodyLoader";
import CustomAvatar from "../../Component/CustomAvatar";
import { getAccessToken, SERVER_URL } from "../../Helpers/AppConfig";
import {
  DateSqlToNow,
  InvalidDateTimeToDefault,
} from "../../Hooks/UseDateParser";
import { StringEmptyToDefault } from "../../Hooks/UseStringFormatter";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageLinksAction,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import ChatConsultApi from "../../Services/Api/ChatConsultApi";
import ConsultRequestApi from "../../Services/Api/ConsultRequestApi";
import ConsultReqChatEntity from "../../Services/Entities/ConsultChatEntity";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import { RootStore } from "../../Services/Store";
import { VideoChatUi } from "../../Styles/GlobalStyles";

interface IResidentConsultRoom {}

const ResidentConsultRoom: FC<IResidentConsultRoom> = memo(() => {
  const { hash_key } = useParams<any>();
  const theme = useTheme();
  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );
  const user = useSelector((store: RootStore) => store.UserReducer.user);
  const dispatch = useDispatch();
  const chat_form_ref = useRef<HTMLFormElement | null>();

  const [selected_record, set_selected_record] =
    useState<ConsultRequestEntity | null>(null);

  const [loading_initial_data, set_loading_initial_data] = useState(false);
  const [error_message, set_error_message] = useState("");

  const [connection, set_connection] = useState(null);
  const message_textfield_ref = useRef<any>(null);

  const [chat_messages, set_chat_messages] = useState<
    Array<ConsultReqChatEntity>
  >([]);
  const [message_body, set_message_body] = useState("");

  const handleSetMessageBody = useCallback((e) => {
    set_message_body(e.target.value);
  }, []);

  const handleReloadSelectedConsult = useCallback(async () => {
    if (!!hash_key) {
      const selected_record_res =
        await ConsultRequestApi.GetAssignResidentOnlineConsult(hash_key);

      if (selected_record_res.success) {
        set_selected_record(selected_record_res.data);
      } else {
        let msg = "";
        if (!selected_record_res.success) {
          msg = msg + selected_record_res.message?.toString();
        }
        set_error_message(msg);
      }
    }
  }, [hash_key]);

  const handleSubmitMessage = useCallback(async () => {
    const connection_id: string = connection.connectionId;

    if (!!connection_id) {
      const payload: ConsultReqChatEntity = {
        msg_body: message_body,
        consult_req_pk: selected_record.consult_req_pk,
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
  }, [connection, dispatch, message_body, selected_record, user]);

  const handleEndConsultation = useCallback(async () => {
    if (!!selected_record?.consult_req_pk) {
      dispatch(
        setGeneralPrompt({
          open: true,
          custom_title: `Are you sure that you want to end this consultation?`,
          continue_callback: async () => {
            dispatch(
              showPageLoading({
                show: true,
                loading_message:
                  "Ending consultation, thank you for your patience",
              })
            );
            const response = await ConsultRequestApi.EndConsult({
              consult_req_pk: selected_record?.consult_req_pk,
            });

            dispatch(closePageLoading());
            dispatch(
              setPageSnackbar(
                response?.message?.toString(),
                response.success ? "success" : "error"
              )
            );
            if (response.success) {
              handleReloadSelectedConsult();
            }
          },
        })
      );
    }
  }, [dispatch, handleReloadSelectedConsult, selected_record]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${SERVER_URL}api/hubs/chat`, {
        accessTokenFactory: () => getAccessToken(),
      })
      .configureLogging(LogLevel.None)
      .build();

    set_connection(newConnection);
  }, []);

  useEffect(() => {
    if (!!connection && !!selected_record?.consult_req_pk) {
      connection
        .start()
        .then((result) => {
          console.log(`result`, result);
          connection.on("GetConsultMessage", async () => {
            const res = await ChatConsultApi.GetConsultChat(
              selected_record.consult_req_pk
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
                consult_req_pk: selected_record.consult_req_pk,
                user_type: "hosp_resident",
                sender_name: selected_record?.email,
              };
              await ChatConsultApi.JoinConsultChat(payload);
            }
          });
          connection.on("disconnected", async () => {
            const connection_id: string = connection.connectionId;
            if (!!connection_id) {
              const payload = {
                connection_id: connection_id,
                consult_req_pk: selected_record.consult_req_pk,
              };
              await ChatConsultApi.LeaveConsultChat(payload);
            }
          });
        })
        .catch((e) => console.error("Connection failed: ", e));
    }
  }, [connection, dispatch, selected_record]);

  useEffect(() => {
    let mounted = true;
    const fetch_initial_data = async () => {
      const res = await ChatConsultApi.GetConsultChat(
        selected_record.consult_req_pk
      );
      if (res.success) {
        set_chat_messages(res.data);
      } else {
        dispatch(setPageSnackbar(res?.message?.toString(), "error"));
      }
    };

    mounted && !!selected_record?.consult_req_pk && fetch_initial_data();

    return () => {
      mounted = false;
    };
  }, [dispatch, selected_record]);

  useEffect(() => {
    const connection_id: string = connection?.connectionId;
    if (!!chat_messages && !!connection_id && message_textfield_ref?.current) {
      message_textfield_ref?.current.scrollIntoView(false);
    }
  }, [chat_messages, connection]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!!hash_key) {
        set_loading_initial_data(true);

        const selected_record_res =
          await ConsultRequestApi.GetAssignResidentOnlineConsult(hash_key);

        if (selected_record_res.success) {
          mounted && set_selected_record(selected_record_res.data);
        } else {
          let msg = "";
          if (!selected_record_res.success) {
            msg = msg + selected_record_res.message?.toString();
          }
          mounted && set_error_message(msg);
        }
        set_loading_initial_data(false);
      }
    }

    mounted && fetchData();

    return () => {
      mounted = false;
    };
  }, [hash_key]);

  useEffect(() => {
    dispatch(
      setPageLinksAction([
        {
          link: `/request`,
          title: "Requests",
        },
        {
          link: `/request/${hash_key}/general`,
          title: selected_record?.consult_req_pk,
        },
        {
          link: `/request/${hash_key}/consult-room`,
          title: `Consultation Room`,
        },
      ])
    );
  }, [dispatch, selected_record, hash_key]);

  if (!!user_type && user_type !== "hosp_resident") {
    return (
      <Alert severity="error">
        Only hospital residents are allowed to access this page.
      </Alert>
    );
  }

  if (!!selected_record && selected_record?.sts_pk !== "s") {
    return <Alert severity="error">This page is no longer available.</Alert>;
  }

  return (
    !!user?.full_name && (
      <>
        <Container maxWidth="lg">
          <div>
            {loading_initial_data ? (
              <BodyLoader message="Loading initial data, thank you for your patience" />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container spacing={1} justify="flex-end">
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          handleEndConsultation();
                        }}
                      >
                        End Consultation
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <VideoChatUi theme={theme}>
                    {!!!!selected_record?.consult_link_hash && (
                      <div className="container-video">
                        <div className="video">
                          <Jutsu
                            roomName={
                              selected_record.hash_key +
                              selected_record.consult_link_hash
                            }
                            displayName={user?.full_name}
                            subject={selected_record.consult_req_pk}
                            containerStyles={{
                              height: `100%`,
                              width: `100%`,
                              border: `none`,
                            }}
                            loadingComponent={<BodyLoader />}
                            errorComponent={
                              <Alert severity="error">
                                The video could not be loaded.
                              </Alert>
                            }
                            configOverwrite={{
                              enableWelcomePage: false,
                              prejoinPageEnabled: false,
                              disableLogCollector: true,
                              defaultLogLevel: "error",
                              startWithVideoMuted: true,
                              startWithAudioMuted: true,
                              disableDeepLinking: true,
                            }}
                            onJitsi={(e) => {
                              console.log(`jitsi details -> `, e);
                            }}
                            loggerConfigOverwrite={{
                              disableLogCollector: false,
                            }}
                            interfaceConfigOverwrite={{
                              disableLogCollector: false,
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
                        <div className="consult-info">
                          <Grid container spacing={1}>
                            <Grid item xs={12} md={4}>
                              <div className="info-group-column">
                                <div className="label">Patient Name</div>
                                <div className="value">
                                  {selected_record?.prefix}{" "}
                                  {selected_record?.first_name}{" "}
                                  {selected_record?.middle_name}{" "}
                                  {selected_record?.last_name}{" "}
                                  {selected_record?.suffix}
                                </div>
                              </div>
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <div className="info-group-column">
                                <div className="label">Started On: </div>
                                <div className="value">
                                  {InvalidDateTimeToDefault(
                                    selected_record?.consult_at,
                                    "-"
                                  )}
                                </div>
                              </div>
                            </Grid>

                            {/* <Grid item xs={12} md={4}>
                              <div className="info-group-column">
                                <div className="label">Est. Start Date: </div>
                                <div className="value">
                                  {InvalidDateToDefault(
                                    selected_record?.est_start_at,
                                    "-"
                                  )}
                                </div>
                              </div>
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <div className="info-group-column">
                                <div className="label">Est. Start Time: </div>
                                <div className="value">
                                  {InvalidTimeToDefault(
                                    selected_record?.est_start_at,
                                    "-"
                                  )}
                                </div>
                              </div>
                            </Grid> */}
                            <Grid item xs={12}>
                              <div className="info-group-column">
                                <div className="label">Chief Complaint</div>
                                <div className="value">
                                  {StringEmptyToDefault(
                                    selected_record?.chief_complaint,
                                    <em>Not indicated</em>
                                  )}
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={12}>
                              <div className="info-group-column">
                                <div className="label">Symptoms</div>
                                <div className="value">
                                  {StringEmptyToDefault(
                                    selected_record?.symptoms,
                                    <em>Not indicated</em>
                                  )}
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    )}
                    <div className="container-chat">
                      <>
                        <div className="cntr-title">
                          <div className="main">Chat</div>
                          <div className="sub">
                            You can communicate with each other here.
                          </div>
                        </div>

                        <div className="sent-msg-ctnr" id="msg-ctnr">
                          {chat_messages.map((msg, i) => (
                            <div className="sent-msg-item" key={i}>
                              <CustomAvatar
                                className="img"
                                src=""
                                alt={msg?.sender_name?.charAt(0)}
                                spacing={4}
                              />
                              <div className="name-msg">
                                <div className="name">{msg.sender_name}</div>
                                <div className="message">{msg.msg_body}</div>
                              </div>
                              <div className="time">
                                {DateSqlToNow(msg.sent_at, "-")}
                              </div>
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
                                border: `none`,
                              },
                            }}
                          />
                          <IconButton
                            form="hook-form"
                            type="submit"
                            style={{
                              backgroundColor: `#785ada7d`,
                              color: `#fff`,
                            }}
                          >
                            <SendRoundedIcon />
                          </IconButton>
                        </form>
                      </>
                    </div>
                  </VideoChatUi>
                </Grid>
              </Grid>
            )}
          </div>
        </Container>
      </>
    )
  );
});

export default ResidentConsultRoom;
