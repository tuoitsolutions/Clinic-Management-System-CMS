import { yupResolver } from "@hookform/resolvers/yup";
import {
  AppBar,
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
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import BodyLoader from "../../Component/BodyLoader";
import CustomAvatar from "../../Component/CustomAvatar";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import { APP_NAME, SERVER_URL } from "../../Helpers/AppConfig";
import {
  DateSqlToNow,
  InvalidDateTimeToDefault,
  InvalidDateToDefault,
  InvalidTimeToDefault,
} from "../../Hooks/UseDateParser";
import { StringEmptyToDefault } from "../../Hooks/UseStringFormatter";
import DefaultValuesActions from "../../Services/Actions/DefaultValuesActions";
import {
  closePageLoading,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import ChatConsultApi from "../../Services/Api/ChatConsultApi";
import ConsultRequestApi from "../../Services/Api/ConsultRequestApi";
import ConsultReqChatEntity from "../../Services/Entities/ConsultChatEntity";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import { RootStore } from "../../Services/Store";
import { ChatBoxUi, PageContainerUi } from "../../Styles/GlobalStyles";
import { StyledOnlineConsultLink } from "./styles";

interface IOnlineConsultLinkView {}

const form_schema = yup.object({
  consult_link_pass: yup.string().required().nullable().label("Link Password"),
});

const OnlineConsultLinkView: FC<IOnlineConsultLinkView> = memo(() => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { hash_key } = useParams();
  const message_textfield_ref = useRef(null);
  const chat_form_ref = useRef<HTMLFormElement | null>();

  const form_def_val = {
    consult_link_pass: "",
  };

  const {
    hospital_name,
    fetch_hospital_name,
    hospital_logo,
    fetch_hospital_logo,
  } = useSelector((store: RootStore) => store.DefaultValuesReducer);
  const [error_message, set_error_message] = useState("");
  const [reload_auth, set_reload_auth] = useState(0);

  const [connection, set_connection] = useState(null);

  const [chat_messages, set_chat_messages] = useState<
    Array<ConsultReqChatEntity>
  >([]);
  const [message_body, set_message_body] = useState("");

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: form_def_val,
  });

  const handleSetMessageBody = useCallback((e) => {
    set_message_body(e.target.value);
  }, []);

  const handleSubmitForm = useCallback(
    async (payload: ConsultRequestEntity) => {
      payload.hash_key = hash_key;

      if (!!payload.hash_key) {
        dispatch(
          showPageLoading({
            show: true,
            loading_message: "Adding item, thank you for your patience",
          })
        );

        const response = await ConsultRequestApi.AuthenticateConsultLink(
          payload
        );

        dispatch(closePageLoading());
        dispatch(
          setPageSnackbar(
            response?.message?.toString(),
            response.success ? "success" : "error"
          )
        );
        if (response.success) {
          localStorage.setItem("jwt_oc", response.data);

          set_reload_auth((p) => p + 1);
        }
      }
    },
    [dispatch, hash_key]
  );

  const [selected_consult_req, set_selected_consult_req] =
    useState<null | ConsultRequestEntity>(null);

  const [fetch_selected_consult_req, set_fetch_selected_consult_req] =
    useState(true);

  const [auth_hash_key, set_auth_hash_key] = useState(false);
  const [loading_auth_hash_key, set_loading_auth_hash_key] = useState(false);

  const handleSubmitMessage = useCallback(async () => {
    const connection_id: string = connection.connectionId;

    if (!!connection_id && !!selected_consult_req) {
      const payload: ConsultReqChatEntity = {
        msg_body: message_body,
        consult_req_pk: selected_consult_req.consult_req_pk,
        user_type: "patient",
        sender_name: `${selected_consult_req.last_name}, ${selected_consult_req?.first_name}`,
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
  }, [connection, dispatch, message_body, selected_consult_req]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${SERVER_URL}api/hubs/chat`, {})
      .configureLogging(LogLevel.None)
      .build();

    set_connection(newConnection);
  }, []);

  useEffect(() => {
    if (!!connection && !!selected_consult_req?.consult_req_pk) {
      connection
        .start()
        .then((result) => {
          // dispatch(setAdminSocketCon(connection));
          connection.on("GetConsultMessage", async () => {
            const res = await ChatConsultApi.GetConsultChat(
              selected_consult_req.consult_req_pk
            );
            if (res.success) {
              set_chat_messages(res.data);
            }
          });

          connection.on("connected", async () => {
            console.log(`connected`);
            const connection_id: string = connection.connectionId;
            if (!!connection_id) {
              const payload: ConsultReqChatEntity = {
                connection_id: connection_id,
                consult_req_pk: selected_consult_req.consult_req_pk,
                sender_pk: "patient",
                sender_name: selected_consult_req?.email,
              };
              await ChatConsultApi.JoinConsultChat(payload);
            }
          });

          connection.on("disconnected", async () => {
            const connection_id: string = connection.connectionId;
            if (!!connection_id) {
              const payload = {
                connection_id: connection_id,
                consult_req_pk: selected_consult_req.consult_req_pk,
              };
              await ChatConsultApi.LeaveConsultChat(payload);
            }
          });
        })
        .catch((e) => console.error("Connection failed: ", e));
    }
  }, [connection, selected_consult_req]);

  useEffect(() => {
    dispatch(DefaultValuesActions.setHospitalLogoAction());
    dispatch(DefaultValuesActions.setHospitalNameAction());
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;
    const fetch_data = async () => {
      set_loading_auth_hash_key(true);
      const jwt_oc = localStorage.getItem("jwt_oc");

      if (!!jwt_oc) {
        const payload: ConsultRequestEntity = {
          hash_key: hash_key,
          consult_link_hash: jwt_oc,
        };
        const response = await ConsultRequestApi.IsConsultLinkAuthenticated(
          payload
        );
        if (response.success) {
          mounted && set_auth_hash_key(true);
        } else {
          localStorage.removeItem("jwt_oc");
          mounted && set_auth_hash_key(false);
          // mounted && set_error_message(response.message.toString());
        }
        mounted && set_loading_auth_hash_key(false);
      }
    };
    mounted && fetch_data();
    return () => {
      mounted = false;
    };
  }, [hash_key, reload_auth]);

  // useEffect(() => {
  //   let mounted = true;
  //   const fetch_initial_data = async () => {
  //     const res = await ChatConsultApi.GetConsultChat(
  //       selected_consult_req.consult_req_pk
  //     );
  //     if (res.success) {
  //       set_chat_messages(res.data);
  //     } else {
  //       dispatch(setPageSnackbar(res?.message?.toString(), "error"));
  //     }
  //   };

  //   mounted && selected_consult_req?.consult_req_pk && fetch_initial_data();

  //   return () => {
  //     mounted = false;
  //   };
  // }, [dispatch, selected_consult_req]);

  useEffect(() => {
    let mounted = true;
    const fetch_initial_data = async () => {
      const res = await ChatConsultApi.GetConsultChat(
        selected_consult_req.consult_req_pk
      );
      if (res.success) {
        set_chat_messages(res.data);
      } else {
        dispatch(setPageSnackbar(res?.message?.toString(), "error"));
      }
    };

    mounted && selected_consult_req && fetch_initial_data();

    return () => {
      mounted = false;
    };
  }, [dispatch, selected_consult_req]);

  useEffect(() => {
    let mounted = true;
    const fetch_data = async () => {
      set_fetch_selected_consult_req(true);
      const response = await ConsultRequestApi.GetPublicOnlineConsult(hash_key);
      if (response.success) {
        set_selected_consult_req(response.data);
      } else {
        mounted && set_error_message(response.message.toString());
      }
      mounted && set_fetch_selected_consult_req(false);
    };
    mounted && fetch_data();
    return () => {
      mounted = false;
    };
  }, [hash_key]);

  useEffect(() => {
    if (!!chat_messages && message_textfield_ref?.current) {
      message_textfield_ref?.current.scrollIntoView(false);
    }
  }, [chat_messages, connection]);

  // console.log(`connection?.connectionId`, connection?.connectionId);
  return fetch_hospital_name && fetch_hospital_logo ? (
    <BodyLoader message="Loading initial data, thank you for your patience" />
  ) : (
    <>
      <PageContainerUi theme={theme}>
        <AppBar className="header-ctnr">
          <CustomAvatar
            className="brand-logo"
            src={hospital_logo}
            alt={hospital_name?.charAt(0)}
            isBlob={true}
            spacing={5}
          />

          <div className="brand-name">{hospital_name}</div>
          <div className="app-name">{APP_NAME}</div>
        </AppBar>

        <>
          <StyledOnlineConsultLink
            className="page-content"
            maxWidth="lg"
            theme={theme}
          >
            {fetch_selected_consult_req ? (
              <>
                <BodyLoader message="Loading consultation information, thank you for your patience!" />
              </>
            ) : (selected_consult_req?.sts_pk === "s" ||
                selected_consult_req?.sts_pk === "pd") &&
              !!selected_consult_req.consult_link_hash ? (
              <>
                {!localStorage.getItem("jwt_oc") ? (
                  <>
                    <Container maxWidth="sm">
                      <div className="panel-container">
                        <div className="cntr-title">
                          <div className="main">
                            Online Consultation Link Authentication
                          </div>
                          <div className="sub">
                            Kindly enter the password that was sent to your
                            email address and mobile number.
                          </div>
                        </div>

                        <FormProvider {...form_instance}>
                          <form
                            onSubmit={form_instance.handleSubmit(
                              handleSubmitForm
                            )}
                            noValidate
                            id="form_instance"
                          >
                            <div
                              style={{
                                display: `grid`,
                                padding: `1.5em 7em`,
                                backgroundColor: `#fff`,
                                borderRadius: 10,
                              }}
                            >
                              <Grid container spacing={5}>
                                <Grid item xs={12}>
                                  <TextFieldHookForm
                                    name="consult_link_pass"
                                    label="Link Password"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    fullWidth
                                    required
                                    placeholder="Enter the link password here"
                                  />
                                </Grid>

                                <Grid item xs={12}>
                                  <Grid
                                    container
                                    spacing={3}
                                    justify="flex-end"
                                  >
                                    <Grid item>
                                      <Button
                                        color="primary"
                                        type="submit"
                                        variant="contained"
                                      >
                                        Authenticate
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </div>
                          </form>
                        </FormProvider>
                      </div>
                    </Container>
                  </>
                ) : (
                  <Grid container spacing={2}>
                    {/* <Grid item xs={12}>
                      <Grid container spacing={1} justify="flex-end">
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                            }}
                          >
                            Leave Consultation
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid> */}
                    <Grid item xs={12}>
                      <div className="content-ctnr">
                        <div className="video-ctnr">
                          <div className="vid">
                            <iframe
                              title="iframe-video"
                              allow="camera; microphone; fullscreen; display-capture"
                              src={`https://meet.jit.si/${
                                hash_key +
                                selected_consult_req?.consult_link_hash
                              }#jitsi_meet_external_api_id=0&config.startWithVideoMuted=true&config.subject="${
                                selected_consult_req.consult_req_pk
                              }"&config.startWithAudioMuted=true&config.enableWelcomePage=false&config.disableDeepLinking=true&config.prejoinPageEnabled=false&interfaceConfig.prejoinPageEnabled=false&interfaceConfig.DISPLAY_WELCOME_FOOTER=false&interfaceConfig.GENERATE_ROOMNAMES_ON_WELCOME_PAGE=false&interfaceConfig.HIDE_INVITE_MORE_HEADER=true&interfaceConfig.HIDE_DEEP_LINKING_LOGO=true&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false&interfaceConfig.TOOLBAR_BUTTONS=%5B%22microphone%22%2C%22camera%22%2C%22desktop%22%2C%22fullscreen%22%2C%22fodeviceselection%22%2C%22hangup%22%2C%22profile%22%2C%22etherpad%22%2C%22settings%22%2C%22raisehand%22%2C%22stats%22%2C%22shortcuts%22%2C%22tileview%22%2C%22videobackgroundblur%22%2C%22mute-everyone%22%5D&appData.localStorageContent=null&userInfo.displayName="${
                                selected_consult_req?.first_name
                              } ${selected_consult_req?.last_name}"`}
                              style={{ height: `100%`, width: `100%` }}
                            ></iframe>
                          </div>
                          <div className="info ">
                            <Grid container spacing={1}>
                              <Grid item xs={12} md={4}>
                                <div className="info-group-column">
                                  <div className="label">Patient Name</div>
                                  <div className="value">
                                    {selected_consult_req?.prefix}{" "}
                                    {selected_consult_req?.first_name}{" "}
                                    {selected_consult_req?.middle_name}{" "}
                                    {selected_consult_req?.last_name}{" "}
                                    {selected_consult_req?.suffix}
                                  </div>
                                </div>
                              </Grid>

                              <Grid item xs={12} md={4}>
                                <div className="info-group-column">
                                  <div className="label">Started On: </div>
                                  <div className="value">
                                    {InvalidDateTimeToDefault(
                                      selected_consult_req?.consult_at,
                                      <em>Not started yet</em>
                                    )}
                                  </div>
                                </div>
                              </Grid>

                              <Grid item xs={12} md={4}>
                                <div className="info-group-column">
                                  <div className="label">Est. Start Date: </div>
                                  <div className="value">
                                    {InvalidDateToDefault(
                                      selected_consult_req?.est_start_at,
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
                                      selected_consult_req?.est_start_at,
                                      "-"
                                    )}
                                  </div>
                                </div>
                              </Grid>
                              <Grid item xs={12}>
                                <div className="info-group-column">
                                  <div className="label">Chief Complaint</div>
                                  <div className="value">
                                    {StringEmptyToDefault(
                                      selected_consult_req?.symptoms,
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
                                      selected_consult_req?.symptoms,
                                      <em>Not indicated</em>
                                    )}
                                  </div>
                                </div>
                              </Grid>
                            </Grid>
                          </div>
                        </div>

                        <div className="chat-ctnr">
                          <ChatBoxUi theme={theme}>
                            <div className="cntr-title">
                              <div className="main">Chat</div>
                              <div className="sub">
                                You can communicate with each other here.
                              </div>
                            </div>
                            <div className="sent-msg-ctnr">
                              {chat_messages.map((msg, i) => (
                                <div className="sent-msg-item" key={i}>
                                  <CustomAvatar
                                    className="img"
                                    src=""
                                    alt={msg?.sender_name?.charAt(0)}
                                    spacing={4}
                                  />
                                  <div className="name-msg">
                                    <div className="name">
                                      {msg.sender_name}
                                    </div>
                                    <div className="message">
                                      {msg.msg_body}
                                    </div>
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
                                  if (
                                    event.key === "Enter" &&
                                    !event.shiftKey
                                  ) {
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
                              <IconButton
                                form="hook-form"
                                type="submit"
                                color="primary"
                              >
                                <SendRoundedIcon />
                              </IconButton>
                            </form>
                          </ChatBoxUi>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                )}
              </>
            ) : (
              <>
                <Alert severity="error">
                  This consultation link is no longer available.
                </Alert>
              </>
            )}
          </StyledOnlineConsultLink>
        </>
      </PageContainerUi>
      {/* <div
        style={{
          width: `100%`,
          display: `grid`,
          alignItems: `center`,
          alignSelf: `center`,
          justifyItems: `center`,
        }}
      >
        {fetch_hospital_name || fetch_hospital_logo ? (
          <BodyLoader />
        ) : !!error_message ? (
          <Alert severity="error">{error_message}</Alert>
        ) : (
          <>
            <StyledOnlineConsultLink maxWidth="lg" theme={theme}>
              <AppBar className="header-ctnr">
                <CustomAvatar
                  className="brand-logo"
                  src={hospital_logo}
                  alt={hospital_name?.charAt(0)}
                  isBlob={true}
                  spacing={5}
                />
                <div className="brand-name">{hospital_name}</div>
                <div className="app-name">{APP_NAME}</div>
              </AppBar>

              <div className="top-margin"></div>

              {fetch_selected_consult_req ? (
                <>
                  <BodyLoader message="Loading consultation information, thank you for your patience!" />
                </>
              ) : selected_consult_req?.sts_pk === "s" &&
                !!selected_consult_req.consult_link_hash ? (
                <>
                  {!localStorage.getItem("jwt_oc") ? (
                    <>
                      <Container maxWidth="sm">
                        <div className="panel-container">
                          <div className="cntr-title">
                            <div className="main">
                              Online Consultation Link Authentication
                            </div>
                            <div className="sub">
                              Kindly enter the password that was sent to your
                              email address and mobile number.
                            </div>
                          </div>

                          <FormProvider {...form_instance}>
                            <form
                              onSubmit={form_instance.handleSubmit(
                                handleSubmitForm
                              )}
                              noValidate
                              id="form_instance"
                            >
                              <div
                                style={{
                                  display: `grid`,
                                  padding: `1.5em 7em`,
                                  backgroundColor: `#fff`,
                                  borderRadius: 10,
                                }}
                              >
                                <Grid container spacing={5}>
                                  <Grid item xs={12}>
                                    <TextFieldHookForm
                                      name="consult_link_pass"
                                      label="Link Password"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      fullWidth
                                      required
                                      placeholder="Enter the link password here"
                                    />
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Grid
                                      container
                                      spacing={3}
                                      justify="flex-end"
                                    >
                                      <Grid item>
                                        <Button
                                          color="primary"
                                          type="submit"
                                          variant="contained"
                                        >
                                          Authenticate
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </div>
                            </form>
                          </FormProvider>
                        </div>
                      </Container>
                    </>
                  ) : (
                    <div className="content-ctnr">
                      <div className="video-ctnr">
                        <div className="vid">
                          <iframe
                            title="iframe-video"
                            allow="camera; microphone; fullscreen; display-capture"
                            src={`https://meet.jit.si/${
                              hash_key + selected_consult_req?.consult_link_hash
                            }#jitsi_meet_external_api_id=0&config.startWithVideoMuted=true&config.subject="${
                              selected_consult_req.consult_req_pk
                            }"&config.startWithAudioMuted=true&config.enableWelcomePage=false&config.prejoinPageEnabled=false&interfaceConfig.prejoinPageEnabled=false&interfaceConfig.DISPLAY_WELCOME_FOOTER=false&interfaceConfig.GENERATE_ROOMNAMES_ON_WELCOME_PAGE=false&interfaceConfig.HIDE_INVITE_MORE_HEADER=true&interfaceConfig.HIDE_DEEP_LINKING_LOGO=true&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false&interfaceConfig.TOOLBAR_BUTTONS=%5B%22microphone%22%2C%22camera%22%2C%22desktop%22%2C%22fullscreen%22%2C%22fodeviceselection%22%2C%22hangup%22%2C%22profile%22%2C%22etherpad%22%2C%22settings%22%2C%22raisehand%22%2C%22stats%22%2C%22shortcuts%22%2C%22tileview%22%2C%22videobackgroundblur%22%2C%22mute-everyone%22%5D&appData.localStorageContent=null&userInfo.displayName="${
                              selected_consult_req?.first_name
                            } ${selected_consult_req?.last_name}"`}
                            style={{ height: `100%`, width: `100%` }}
                          ></iframe>
                        </div>
                        <div className="info ">
                          <div className="panel-container">
                            <Grid container spacing={3}>
                              <Grid item xs={3}>
                                <div className="info-group-column">
                                  <div className="label">
                                    Consult Req. Code:{" "}
                                  </div>
                                  <div className="value">
                                    {selected_consult_req?.consult_req_pk}
                                  </div>
                                </div>
                              </Grid>
                              <Grid item xs={3}>
                                <div className="info-group-column">
                                  <div className="label">Start Date: </div>
                                  <div className="value">
                                    {InvalidDateToDefault(
                                      selected_consult_req?.consult_at,
                                      "TBD"
                                    )}
                                  </div>
                                </div>
                              </Grid>
                              <Grid item xs={3}>
                                <div className="info-group-column">
                                  <div className="label">Start Time: </div>
                                  <div className="value">
                                    {InvalidTimeToDefault(
                                      selected_consult_req?.consult_at,
                                      "TBD"
                                    )}
                                  </div>
                                </div>
                              </Grid>
                              <Grid item xs={12}>
                                <div className="info-group-column">
                                  <div className="label">Doctor: </div>
                                  <div className="value">
                                    {selected_consult_req?.assign_res_desc}
                                  </div>
                                </div>
                              </Grid>
                            </Grid>
                          </div>
                        </div>
                      </div>

                      {!!connection?.connectionId && (
                        <div className="chat-ctnr">
                          <ChatBoxUi theme={theme}>
                            <div className="cntr-title">
                              <div className="main">Chat</div>
                              <div className="sub">
                                You can communicate with each other here.
                              </div>
                            </div>

                            <div className="chat-content">
                              <div className="sent-msg-ctnr">
                                {chat_messages.map((msg, i) => (
                                  <div className="sent-msg-item" key={i}>
                                    <CustomAvatar
                                      className="img"
                                      src=""
                                      alt={msg?.sender_name?.charAt(0)}
                                      spacing={4}
                                    />
                                    <div className="name-msg">
                                      <div className="name">
                                        {msg.sender_name}
                                      </div>
                                      <div className="message">
                                        {msg.msg_body}
                                      </div>
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
                                    if (
                                      event.key === "Enter" &&
                                      !event.shiftKey
                                    ) {
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
                                <IconButton
                                  form="hook-form"
                                  type="submit"
                                  color="primary"
                                >
                                  <SendRoundedIcon />
                                </IconButton>
                              </form>
                            </div>
                          </ChatBoxUi>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Alert severity="error">
                    This consultation link is no longer available.
                  </Alert>
                </>
              )}
            </StyledOnlineConsultLink>
          </>
        )}
      </div> */}
    </>
  );
});

export default OnlineConsultLinkView;
