import { Button, Container, Grid, useTheme } from "@material-ui/core";
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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BodyLoader from "../../Component/BodyLoader";
import CustomTab from "../../Component/CustomTabs";
import PreviewPDF from "../../Component/PreviewPDF";
import { getAccessToken, SERVER_URL } from "../../Helpers/AppConfig";
import { StringEmptyToDefault } from "../../Hooks/UseStringFormatter";
import PageActions, {
  closePageLoading,
  setGeneralPrompt,
  setPageLinksAction,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import ChatConsultApi from "../../Services/Api/ChatConsultApi";
import ConsultRequestApi from "../../Services/Api/ConsultRequestApi";
import ConsultRequestFileApi from "../../Services/Api/ConsultRequestFileApi";
import ConsultReqChatEntity from "../../Services/Entities/ConsultChatEntity";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import ConsultRequestFileEntity from "../../Services/Entities/ConsultRequestFileEntity";
import { RootStore } from "../../Services/Store";
import TabOnlineConsultChat from "./TabOnlineConsultChat";
import TabOnlineConsultSharedFiles from "./TabOnlineConsultSharedFiles";
import TabResidentVideoCall from "./TabResidentVideoCall";
import WriteDiagnosisDialog from "./WriteDiagnosisDialog";

interface IResidentConsultRoom {}

const ResidentConsultRoom: FC<IResidentConsultRoom> = memo(() => {
  const { hash_key } = useParams<any>();
  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );
  const user = useSelector((store: RootStore) => store.UserReducer.user);
  const dispatch = useDispatch();

  const [selected_record, set_selected_record] =
    useState<ConsultRequestEntity | null>(null);

  const [reload_all_data, set_reload_all_data] = useState(0);
  const [loading_initial_data, set_loading_initial_data] = useState(false);
  const [error_message, set_error_message] = useState("");

  const [connection, set_connection] = useState(null);

  const [selected_consult_file, set_selected_consult_file] =
    useState<ConsultRequestFileEntity | null>(null);

  const [open_diagnosis_dialog, set_open_diagnosis_dialog] = useState(null);

  const handleSetSelectedFile = useCallback(
    async (file_pk?: number) => {
      if (!!hash_key) {
        dispatch(
          PageActions.showPageLoading({
            loading_message: "Preparing the file, thank you for your patience.",
            show: true,
          })
        );
        const selected_consult_file_response =
          await ConsultRequestFileApi.GetConsultReqFileByPk(file_pk);
        dispatch(PageActions.closePageLoading());

        if (selected_consult_file_response.success) {
          set_selected_consult_file(selected_consult_file_response.data);
        } else {
          dispatch(
            setPageSnackbar(
              selected_consult_file_response.message.toString(),
              "error"
            )
          );
        }
      }
    },
    [dispatch, hash_key]
  );

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
    const signalr_con = new HubConnectionBuilder()
      .withUrl(`${SERVER_URL}api/hubs/chat`, {
        accessTokenFactory: () => getAccessToken(),
      })
      .configureLogging(LogLevel.None)
      .build();

    set_connection(signalr_con);
  }, []);

  useEffect(() => {
    if (!!connection && !!selected_record) {
      connection
        .start()
        .then((result) => {
          connection.on("GetConsultMessage", async () => {
            const res = await ChatConsultApi.GetConsultChat(
              selected_record.consult_req_pk
            );
            if (res.success) {
              set_reload_all_data((r) => r + 1);
            } else {
              dispatch(setPageSnackbar(res?.message?.toString(), "error"));
            }
          });

          connection.on("connected", async () => {
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
                          set_open_diagnosis_dialog(true);
                        }}
                      >
                        Write Diagnosis
                      </Button>
                    </Grid>
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
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8} lg={9}>
                      {!!selected_record?.consult_link_hash && (
                        <TabResidentVideoCall consult_info={selected_record} />
                      )}
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                      <div
                        className="tab-container"
                        style={{
                          backgroundColor: `#fff`,
                          borderRadius: 10,
                          boxShadow: `0 0 20px rgba(0,0,0,.05)`,
                          paddingTop: `.5em`,
                        }}
                      >
                        <CustomTab
                          height={`70vh`}
                          tabs={[
                            {
                              title: "Chat",
                              RenderComponent: (
                                <>
                                  <TabOnlineConsultChat
                                    consult_info={selected_record}
                                    handleSetSelectedFile={
                                      handleSetSelectedFile
                                    }
                                    reload_file={reload_all_data}
                                    connection={connection}
                                  />
                                </>
                              ),
                            },
                            {
                              title: "Shared Files",
                              RenderComponent: (
                                <TabOnlineConsultSharedFiles
                                  consult_info={selected_record}
                                  handleSetSelectedFile={handleSetSelectedFile}
                                  reload_file={reload_all_data}
                                />
                              ),
                            },
                          ]}
                        />

                        {open_diagnosis_dialog && !!selected_record && (
                          <WriteDiagnosisDialog
                            open_dialog={open_diagnosis_dialog}
                            handleClose={() => set_open_diagnosis_dialog(false)}
                            consult_info={selected_record}
                            successCallback={() => {
                              handleReloadSelectedConsult();
                            }}
                          />
                        )}

                        {!!selected_consult_file?.file_dest && (
                          <>
                            <PreviewPDF
                              file={selected_consult_file?.file_dest}
                              doc_title={StringEmptyToDefault(
                                selected_consult_file?.file_name +
                                  selected_consult_file?.file_ext,
                                selected_consult_file?.file_dest
                              )}
                              handleClose={() => {
                                set_selected_consult_file(null);
                              }}
                              actions={<></>}
                            />
                          </>
                        )}
                      </div>
                    </Grid>
                  </Grid>
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
