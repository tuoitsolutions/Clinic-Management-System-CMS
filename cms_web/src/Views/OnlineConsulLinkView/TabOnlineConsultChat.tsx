import { Grid, IconButton, useTheme } from "@material-ui/core";
import AttachFileRoundedIcon from "@material-ui/icons/AttachFileRounded";
import CancelPresentationRoundedIcon from "@material-ui/icons/CancelPresentationRounded";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import PreviewPictureFtp from "../../Component/PreviewPictureFtp";
import { InvalidDateTimeToDefault } from "../../Hooks/UseDateParser";
import useFormData from "../../Hooks/useFormData";
import { setPageSnackbar } from "../../Services/Actions/PageActions";
import ChatConsultApi from "../../Services/Api/ChatConsultApi";
import ConsultRequestApi from "../../Services/Api/ConsultRequestApi";
import UserApi from "../../Services/Api/UserApi";
import ConsultReqChatEntity from "../../Services/Entities/ConsultChatEntity";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import ChatBoxUi from "../../Styles/ChatBoxUi";
interface ITabOnlineConsultChat {
  consult_info: ConsultRequestEntity;
  handleSetSelectedFile?: (id: number) => void;
  reload_file: number;
  connection?: any;
}

const TabOnlineConsultChat: FC<ITabOnlineConsultChat> = memo(
  ({ consult_info, handleSetSelectedFile, reload_file, connection }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const message_textfield_ref = useRef<any>(null);

    const [chat_messages, set_chat_messages] = useState<
      Array<ConsultReqChatEntity>
    >([]);
    const [sending_msg, set_sending_msg] = useState(false);

    const form_instance = useForm<any>({
      mode: "onChange",
      defaultValues: {
        msg_body: "",
        attached_files: [],
      },
    });

    const handleSubmitMessage = useCallback(
      async (form_payload: ConsultReqChatEntity) => {
        const connection_id: string = connection.connectionId;

        if (form_payload?.attached_files?.length > 3) {
          dispatch(
            setPageSnackbar(
              "You are only allowed to send at least 3 files at a time",
              "error"
            )
          );
          return;
        }

        if (
          form_payload?.attached_files?.length <= 0 &&
          !form_payload.msg_body
        ) {
          dispatch(
            setPageSnackbar(
              "Please specify a message or attach at least a file",
              "error"
            )
          );
          return;
        }

        if (!!connection_id && !!consult_info) {
          form_payload.connection_id = connection_id;
          form_payload.user_type = "patient";
          form_payload.consult_req_pk = consult_info?.consult_req_pk;
          form_payload.sender_name = `${consult_info?.last_name}, ${consult_info?.first_name}`;

          // const payload: ConsultReqChatEntity = {
          //   msg_body: message_body,
          //   consult_req_pk: selected_consult_req.consult_req_pk,
          //   user_type: "patient",
          //   sender_name: `${selected_consult_req.last_name}, ${selected_consult_req?.first_name}`,
          //   connection_id: connection_id,
          // };

          const payload = new FormData();
          useFormData.convertModelToFormData(form_payload, payload);

          form_payload?.attached_files?.forEach((f) => {
            payload.append("attached_files", f);
          });

          set_sending_msg(true);
          const res = await ChatConsultApi.InsertConsultChat(payload);
          set_sending_msg(false);

          if (res.success) {
            form_instance.reset({});
            const res = await ChatConsultApi.GetConsultChat(
              consult_info.consult_req_pk
            );
            if (res.success) {
              set_chat_messages(res.data);
            } else {
              dispatch(setPageSnackbar(res?.message?.toString(), "error"));
            }
          } else {
            dispatch(setPageSnackbar(res?.message?.toString(), "error"));
          }
        }
      },
      [connection, dispatch, form_instance, consult_info]
    );

    useEffect(() => {
      let mounted = true;
      const fetch_initial_data = async () => {
        const res = await ChatConsultApi.GetConsultChat(
          consult_info.consult_req_pk
        );
        console.log(`res`, res);
        if (res.success) {
          set_chat_messages(res.data);
        } else {
          dispatch(setPageSnackbar(res?.message?.toString(), "error"));
        }
      };

      mounted && !!consult_info?.consult_req_pk && fetch_initial_data();

      return () => {
        mounted = false;
      };
    }, [dispatch, consult_info, reload_file]);

    useEffect(() => {
      const connection_id: string = connection?.connectionId;
      if (
        !!chat_messages &&
        !!connection_id &&
        message_textfield_ref?.current
      ) {
        message_textfield_ref?.current.scrollIntoView(false);
      }
    }, [chat_messages, connection]);
    return (
      <>
        <ChatBoxUi theme={theme}>
          <>
            <div className="ctnr-title">
              <div className="main">Chat</div>
              <div className="sub">
                You can communicate with the patient here.
              </div>
            </div>

            <div className="chat-msg" id="msg-ctnr">
              {chat_messages.map((r, i) => (
                <div className="msg-item" key={i}>
                  {r.user_type === "hosp_resident" ? (
                    <PreviewPictureFtp
                      className="img"
                      spacing={5}
                      api_func={UserApi.GetResidentPicByUserPk}
                      api_params={r.sender_pk}
                      watch_change={"a"}
                    />
                  ) : (
                    <>
                      <PreviewPictureFtp
                        className="img"
                        spacing={5}
                        api_func={ConsultRequestApi.PreviewRequesterPic}
                        api_params={r.consult_req_pk}
                        watch_change={"a"}
                      />
                    </>
                  )}
                  <div
                    className={`name-msg ${!!r?.cr_file_pk && "file-message"}`}
                    onClick={() => {
                      if (!!r?.cr_file_pk) {
                        handleSetSelectedFile(r.cr_file_pk);
                      }
                    }}
                  >
                    <div className="name">{r.sender_name}</div>
                    <div className={`message`}>{r?.msg_body}</div>
                  </div>
                  <div className="time">
                    {InvalidDateTimeToDefault(r.sent_at, "-")}
                  </div>
                </div>
              ))}
              <div ref={message_textfield_ref} />
            </div>
            <form
              id="hook-form"
              onSubmit={form_instance.handleSubmit(handleSubmitMessage)}
              className="chat-actions"
            >
              <FormProvider {...form_instance}>
                <div>
                  <Controller
                    control={form_instance.control}
                    name={"attached_files"}
                    defaultValue={[]}
                    render={({ name, value }) => {
                      return (
                        <>
                          <div className="chat-files">
                            <Grid
                              container
                              className="file-attach-ctnr"
                              spacing={1}
                            >
                              {value?.map((f, i) => (
                                <Grid item className="file-attach-item" key={i}>
                                  <div className="file-name">{f.name}</div>
                                  <IconButton
                                    className="file-btn"
                                    size="small"
                                    color="secondary"
                                    onClick={() => {
                                      const files =
                                        form_instance.getValues(name);
                                      if (files instanceof Array) {
                                        files.splice(i, 1);
                                      }
                                      form_instance.setValue(name, [...files], {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      });
                                    }}
                                  >
                                    <CancelPresentationRoundedIcon fontSize="small" />
                                  </IconButton>
                                </Grid>
                              ))}
                            </Grid>
                            <div className="file-btn">
                              <input
                                accept={"image/*,.pdf"}
                                style={{
                                  display: `none`,
                                }}
                                id="icon-button-file"
                                type="file"
                                multiple={true}
                                onChange={(e) => {
                                  const file_list: any = e?.target?.files;

                                  form_instance.setValue("attached_files", [
                                    ...file_list,
                                  ]);
                                }}
                              />
                              <label htmlFor="icon-button-file">
                                <IconButton
                                  color="primary"
                                  aria-label="upload picture"
                                  component="span"
                                  size={"small"}
                                >
                                  <AttachFileRoundedIcon />
                                </IconButton>
                              </label>
                            </div>
                          </div>
                        </>
                      );
                    }}
                  />
                  <div className="chat-compose">
                    <textarea
                      placeholder="Type your message"
                      className="write-btn"
                      name="msg_body"
                      ref={form_instance.register()}
                      onKeyDown={(event: any): void => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          form_instance.handleSubmit(handleSubmitMessage)();
                          event?.preventDefault();
                        }
                      }}
                    />

                    <IconButton
                      form="hook-form"
                      type="submit"
                      disabled={sending_msg}
                    >
                      <SendRoundedIcon color="primary" />
                    </IconButton>
                  </div>
                </div>
              </FormProvider>
            </form>
          </>
        </ChatBoxUi>
      </>
    );
  }
);

export default TabOnlineConsultChat;
