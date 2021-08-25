import {
  Badge,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import { Alert } from "@material-ui/lab";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BodyLoader from "../../../Component/BodyLoader";
import ButtonPopper from "../../../Component/ButtonPopper";
import LinkTabs, { ILinkTab } from "../../../Component/LinkTabs";
import PreviewPDF from "../../../Component/PreviewPDF";
import HelpNumber from "../../../Helpers/HelpNumber";
import {
  InvalidDateTimeToDefault,
  InvalidDateToDefault,
} from "../../../Hooks/UseDateParser";
import { StringEmptyToDefault } from "../../../Hooks/UseStringFormatter";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageLinksAction,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultMedApi from "../../../Services/Api/ConsultMedApi";
import ConsultProcApi from "../../../Services/Api/ConsultProcApi";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import { RootStore } from "../../../Services/Store";
import ConsultRoom from "./ConsultRoom";
import DialogAssignConsultDept from "./DialogAssignConsultDept";
import DialogChangeConsultCost from "./DialogChangeConsultCost";
import DialogDeclineConsultReq from "./DialogDeclineConsultReq";
import DialogMapConsultPatient from "./DialogMapConsultPatient";
import DialogStartConsult from "./DialogStartConsult";
import TabAllergyRecord from "./TabAllergyRecord";
import TabDeptResident from "./TabFileRecord";
import TabImmuneRecord from "./TabImmuneRecord";
import TabMedProbRecord from "./TabMedProbRecord";
import TabMedRecord from "./TabMedRecord";
import TabPatHistoryRecord from "./TabPatHistoryRecord";
import TabPaymentLog from "./TabPaymentLog";
import TabProcRecord from "./TabProcRecord";
import VitalSignRecord from "./TabVitalSignRecord";

interface IManageConsultReqView {}

interface IParams {
  hash_key: string;
}

const ManageConsultReqView: FC<IManageConsultReqView> = memo(() => {
  const dispatch = useDispatch();
  const params = useParams<IParams>();

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );

  const [loading_initial_data, set_loading_initial_data] = useState(false);
  const [selected_record, set_selected_record] =
    useState<null | ConsultRequestEntity>(null);
  const [error_message, set_error_message] = useState("");

  const [open_decline_dialog, set_open_decline_dialog] = useState(false);
  const [reload_record_count, set_reload_record_count] = useState(0);

  const [open_assign_dept_dialog, set_open_assign_dept_dialog] =
    useState(false);

  const [open_change_consult_cost_dialog, set_open_change_consult_cost_dialog] =
    useState(false);

  const [open_map_consult_dialog, set_open_map_consult_dialog] =
    useState(false);

  const [open_start_consult_dialog, set_open_start_consult_dialog] =
    useState(false);

  const handleReloadRecord = useCallback(() => {
    set_reload_record_count((c) => c + 1);
  }, []);

  const [preview_soa, set_preview_soa] = useState("");
  const [preview_med_presc, set_preview_med_presc] = useState("");
  const [preview_proc_presc, set_preview_proc_presc] = useState("");

  const handlePreviewSoa = useCallback(async () => {
    if (!!selected_record?.consult_req_pk) {
      dispatch(
        showPageLoading({
          show: true,
          loading_message:
            "Loading Statement of account (SOA), thank you for your patience",
        })
      );
      const response = await ConsultRequestApi.PreviewConsultSoa(
        selected_record.consult_req_pk
      );
      dispatch(closePageLoading());

      if (response.success) {
        set_preview_soa(response.data);
      }
      dispatch(
        setPageSnackbar(
          response?.message?.toString(),
          response.success ? "success" : "error"
        )
      );
    }
  }, [dispatch, selected_record]);

  const handlePreviewMedPrescrip = useCallback(async () => {
    if (!!selected_record?.consult_req_pk) {
      dispatch(
        showPageLoading({
          show: true,
          loading_message:
            "Loading Medical Prescription, thank you for your patience",
        })
      );
      const response = await ConsultMedApi.PreviewMedPrescrip(
        selected_record.consult_req_pk
      );
      dispatch(closePageLoading());

      if (response.success) {
        set_preview_med_presc(response.data);
      }
      dispatch(
        setPageSnackbar(
          response?.message?.toString(),
          response.success ? "success" : "error"
        )
      );
    }
  }, [dispatch, selected_record]);

  const handlePreviewProcPrescrip = useCallback(async () => {
    if (!!selected_record?.consult_req_pk) {
      dispatch(
        showPageLoading({
          show: true,
          loading_message:
            "Loading Procedure Prescription, thank you for your patience",
        })
      );
      const response = await ConsultProcApi.PreviewProcPrescrip(
        selected_record.consult_req_pk
      );
      dispatch(closePageLoading());

      if (response.success) {
        set_preview_proc_presc(response.data);
      }
      dispatch(
        setPageSnackbar(
          response?.message?.toString(),
          response.success ? "success" : "error"
        )
      );
    }
  }, [dispatch, selected_record]);

  const handleSendPaymentLink = useCallback(async () => {
    dispatch(
      setGeneralPrompt({
        open: true,
        custom_title: `Are you sure that you want to send the payment link the the requestor?`,
        continue_callback: async () => {
          dispatch(
            showPageLoading({
              show: true,
              loading_message:
                "Sending payment link, thank you for your patience",
            })
          );
          const response = await ConsultRequestApi.SendPaymentLink(
            selected_record.consult_req_pk
          );

          dispatch(closePageLoading());
          dispatch(
            setPageSnackbar(
              response?.message?.toString(),
              response.success ? "success" : "error"
            )
          );
          if (response.success) {
            handleReloadRecord();
          }
        },
      })
    );
  }, [dispatch, handleReloadRecord, selected_record]);

  const handleEmailSoa = useCallback(async () => {
    if (!!preview_soa && !!selected_record?.consult_req_pk) {
      dispatch(
        setGeneralPrompt({
          open: true,
          custom_title: `Are you sure that you want to send the Statement of Account (SOA) the requestor's email?`,
          continue_callback: async () => {
            dispatch(
              showPageLoading({
                show: true,
                loading_message:
                  "Emailing Statement of Account (SOA), thank you for your patience",
              })
            );
            const response = await ConsultRequestApi.EmailConsultRequestSoa({
              consult_req_pk: selected_record.consult_req_pk,
              attach_base64_soa: `${preview_soa}`,
            });

            dispatch(closePageLoading());
            dispatch(
              setPageSnackbar(
                response?.message?.toString(),
                response.success ? "success" : "error"
              )
            );
            if (response.success) {
              handleReloadRecord();
            }
          },
        })
      );
    }
  }, [dispatch, handleReloadRecord, preview_soa, selected_record]);

  const handleEmailMedPrescrip = useCallback(async () => {
    if (!!preview_med_presc && !!selected_record?.consult_req_pk) {
      dispatch(
        setGeneralPrompt({
          open: true,
          custom_title: `Are you sure that you want to send the Medical Prescription the requestor's email?`,
          continue_callback: async () => {
            dispatch(
              showPageLoading({
                show: true,
                loading_message:
                  "Emailing Medical Prescription, thank you for your patience",
              })
            );
            const response = await ConsultMedApi.EmailMedPrescrip({
              consult_req_pk: selected_record.consult_req_pk,
              attach_file: `${preview_med_presc}`,
            });

            dispatch(closePageLoading());
            dispatch(
              setPageSnackbar(
                response?.message?.toString(),
                response.success ? "success" : "error"
              )
            );
            if (response.success) {
              handleReloadRecord();
            }
          },
        })
      );
    }
  }, [dispatch, handleReloadRecord, preview_med_presc, selected_record]);

  const handleEmailProcPrescrip = useCallback(async () => {
    if (!!preview_proc_presc && !!selected_record?.consult_req_pk) {
      dispatch(
        setGeneralPrompt({
          open: true,
          custom_title: `Are you sure that you want to send the Procedure Prescription the requestor's email?`,
          continue_callback: async () => {
            dispatch(
              showPageLoading({
                show: true,
                loading_message:
                  "Emailing Procedure Prescription, thank you for your patience",
              })
            );
            const response = await ConsultProcApi.EmailProcPrescrip({
              consult_req_pk: selected_record.consult_req_pk,
              attach_file: `${preview_proc_presc}`,
            });

            dispatch(closePageLoading());
            dispatch(
              setPageSnackbar(
                response?.message?.toString(),
                response.success ? "success" : "error"
              )
            );
            if (response.success) {
              handleReloadRecord();
            }
          },
        })
      );
    }
  }, [dispatch, handleReloadRecord, preview_proc_presc, selected_record]);

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
              consult_req_pk: selected_record.consult_req_pk,
            });

            dispatch(closePageLoading());
            dispatch(
              setPageSnackbar(
                response?.message?.toString(),
                response.success ? "success" : "error"
              )
            );
            if (response.success) {
              handleReloadRecord();
            }
          },
        })
      );
    }
  }, [dispatch, handleReloadRecord, selected_record]);

  const handleTakeOverConsultation = useCallback(async () => {
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
            const response = await ConsultRequestApi.TakeOverConsult({
              consult_req_pk: selected_record.consult_req_pk,
            });

            dispatch(closePageLoading());
            dispatch(
              setPageSnackbar(
                response?.message?.toString(),
                response.success ? "success" : "error"
              )
            );
            if (response.success) {
              handleReloadRecord();
            }
          },
        })
      );
    }
  }, [dispatch, handleReloadRecord, selected_record]);

  const GenerateTabLinks = useCallback(() => {
    let LinkTabRoutes: Array<ILinkTab> = [];

    if (user_type === "hosp_resident") {
      LinkTabRoutes = [
        {
          label: "Files",
          link: `/request/${params.hash_key}/file`,
          Component: (
            <TabDeptResident consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Vital Signs",
          link: `/request/${params.hash_key}/vital-sign`,
          Component: (
            <VitalSignRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Medications",
          link: `/request/${params.hash_key}/medication`,
          Component: (
            <TabMedRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Procedures",
          link: `/request/${params.hash_key}/procedure`,
          Component: (
            <TabProcRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Allergies",
          link: `/request/${params.hash_key}/allergy`,
          Component: (
            <TabAllergyRecord
              consult_req_pk={selected_record?.consult_req_pk}
            />
          ),
        },
        {
          label: "Immunizations",
          link: `/request/${params.hash_key}/immunization`,
          Component: (
            <TabImmuneRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Medical Problems",
          link: `/request/${params.hash_key}/medical-problem`,
          Component: (
            <TabMedProbRecord
              consult_req_pk={selected_record?.consult_req_pk}
            />
          ),
        },
        {
          label: "Chat History",
          link: `/request/${params.hash_key}/chat-history`,
          Component: <div></div>,
        },
        {
          label: "Patient History",
          link: `/request/${params.hash_key}/patient-history`,
          Component: <TabPatHistoryRecord selected_row={selected_record} />,
        },
      ];
    } else if (user_type === "admin") {
      LinkTabRoutes = [
        {
          label: "Files",
          link: `/request/${params.hash_key}/file`,
          Component: (
            <TabDeptResident consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Payment Logs",
          link: `/request/${params.hash_key}/payment-logs`,
          Component: (
            <TabPaymentLog consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Vital Signs",
          link: `/request/${params.hash_key}/vital-sign`,
          Component: (
            <VitalSignRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Medications",
          link: `/request/${params.hash_key}/medication`,
          Component: (
            <TabMedRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Procedures",
          link: `/request/${params.hash_key}/procedure`,
          Component: (
            <TabProcRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Allergies",
          link: `/request/${params.hash_key}/allergy`,
          Component: (
            <TabAllergyRecord
              consult_req_pk={selected_record?.consult_req_pk}
            />
          ),
        },
        {
          label: "Immunizations",
          link: `/request/${params.hash_key}/immunization`,
          Component: (
            <TabImmuneRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Medical Problems",
          link: `/request/${params.hash_key}/medical-problem`,
          Component: (
            <TabMedProbRecord
              consult_req_pk={selected_record?.consult_req_pk}
            />
          ),
        },
        {
          label: "Patient History",
          link: `/request/${params.hash_key}/patient-history`,
          Component: <TabPatHistoryRecord selected_row={selected_record} />,
        },
      ];
    }

    return LinkTabRoutes;
  }, [selected_record, user_type]);

  // let LinkTabRoutes: Array<ILinkTab> = [
  //   {
  //     label: "Files",
  //     link: `/request/${params.hash_key}/file`,
  //     Component: (
  //       <TabDeptResident consult_req_pk={selected_record?.consult_req_pk} />
  //     ),
  //   },
  //   {
  //     label: "Payment Logs",
  //     link: `/request/${params.hash_key}/payment-logs`,
  //     Component: (
  //       <TabPaymentLog consult_req_pk={selected_record?.consult_req_pk} />
  //     ),
  //   },
  //   {
  //     label: "Vital Signs",
  //     link: `/request/${params.hash_key}/vital-sign`,
  //     Component: (
  //       <VitalSignRecord consult_req_pk={selected_record?.consult_req_pk} />
  //     ),
  //   },
  //   {
  //     label: "Medications",
  //     link: `/request/${params.hash_key}/medication`,
  //     Component: (
  //       <TabMedRecord consult_req_pk={selected_record?.consult_req_pk} />
  //     ),
  //   },
  //   {
  //     label: "Procedures",
  //     link: `/request/${params.hash_key}/procedure`,
  //     Component: (
  //       <TabProcRecord consult_req_pk={selected_record?.consult_req_pk} />
  //     ),
  //   },
  //   {
  //     label: "Allergies",
  //     link: `/request/${params.hash_key}/allergy`,
  //     Component: (
  //       <TabAllergyRecord consult_req_pk={selected_record?.consult_req_pk} />
  //     ),
  //   },
  //   {
  //     label: "Immunizations",
  //     link: `/request/${params.hash_key}/immunization`,
  //     Component: (
  //       <TabImmuneRecord consult_req_pk={selected_record?.consult_req_pk} />
  //     ),
  //   },
  //   {
  //     label: "Medical Problems",
  //     link: `/request/${params.hash_key}/medical-problem`,
  //     Component: (
  //       <TabMedProbRecord consult_req_pk={selected_record?.consult_req_pk} />
  //     ),
  //   },
  //   {
  //     label: "Chat History",
  //     link: `/request/${params.hash_key}/chat-history`,
  //     Component: <div></div>,
  //   },
  //   {
  //     label: "Patient History",
  //     link: `/request/${params.hash_key}/patient-history`,
  //     Component: <div></div>,
  //   },
  // ];

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      set_loading_initial_data(true);

      const hash_key: string = params.hash_key;

      if (!!hash_key) {
        const selected_record_res = await ConsultRequestApi.GetConsultReqByPk(
          hash_key
        );

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
  }, [reload_record_count]);

  useEffect(() => {
    dispatch(
      setPageLinksAction([
        {
          link: `/request`,
          title: "Consult Request Records",
        },
        {
          link: window.location.pathname,
          title: "Manage",
        },
      ])
    );
  }, [dispatch, user_type]);
  return (
    <>
      {!loading_initial_data ? (
        !!error_message ? (
          <Alert severity="error">{error_message}</Alert>
        ) : (
          !!selected_record && (
            <Container maxWidth="lg">
              <Grid container spacing={3}>
                {selected_record?.sts_pk === "s" &&
                  user_type === "hosp_resident" && (
                    <Grid item xs={12}>
                      <div className="panel-container">
                        <ConsultRoom selected_row={selected_record} />
                      </div>
                    </Grid>
                  )}
                <Grid item xs={12}>
                  <div className="panel-container">
                    <Grid container spacing={6}>
                      <Grid item xs={12}>
                        <Grid item container spacing={3} justify="flex-end">
                          {selected_record?.sts_pk === "fa" &&
                            selected_record?.pay_link_sent_count <= 0 && (
                              <>
                                {/* <Grid item>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                      handleSendPaymentLink();
                                    }}
                                  >
                                    Send Payment Link
                                  </Button>
                                </Grid> */}
                                <Grid item>
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                      set_open_decline_dialog(true);
                                    }}
                                  >
                                    Decline Request
                                  </Button>
                                </Grid>
                              </>
                            )}

                          {selected_record?.sts_pk === "pd" &&
                            user_type === "hosp_resident" && (
                              <>
                                <Grid item>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                      set_open_start_consult_dialog(true);
                                    }}
                                  >
                                    Start Consultation
                                  </Button>
                                </Grid>
                              </>
                            )}

                          {selected_record?.sts_pk === "pd" && (
                            <>
                              <Grid item>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    // handleSendPaymentLink();
                                    set_open_assign_dept_dialog(true);
                                  }}
                                >
                                  Set Department
                                </Button>
                              </Grid>
                            </>
                          )}

                          {selected_record?.sts_pk === "s" &&
                            user_type === "hosp_resident" && (
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
                            )}

                          {selected_record?.sts_pk === "pd" &&
                            !selected_record.assign_res_pk &&
                            user_type === "hosp_resident" && (
                              <Grid item>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    handleTakeOverConsultation();
                                  }}
                                >
                                  Take Over Consultation
                                </Button>
                              </Grid>
                            )}

                          <Grid item>
                            <ButtonPopper
                              actionLabel="Documents"
                              variant="contained"
                              buttonColor="primary"
                              buttons={[
                                {
                                  text: `Send Payment Link `,
                                  disabled: selected_record.sts_pk !== "fa",
                                  badge_value:
                                    selected_record.pay_link_sent_count,
                                  handleClick: () => {
                                    handleSendPaymentLink();
                                  },
                                },
                                {
                                  text: "Preview SOA",
                                  handleClick: () => {
                                    handlePreviewSoa();
                                  },
                                },
                                {
                                  text: "Preview Medical Prescrip.",
                                  handleClick: () => {
                                    handlePreviewMedPrescrip();
                                  },
                                },
                                {
                                  text: "Preview Procedure Prescrip.",
                                  handleClick: () => {
                                    handlePreviewProcPrescrip();
                                  },
                                },
                                {
                                  text: "Send SMS",
                                  handleClick: () => {
                                    console.log(`..`);
                                  },
                                },
                                {
                                  text: "Compose an Email",
                                  handleClick: () => {
                                    console.log(`..`);
                                  },
                                },
                              ]}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={4} lg={2}>
                            <div className="info-group-column">
                              <div className="label">Consult Req. Code: </div>
                              <div className="value">
                                {selected_record?.consult_req_pk}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={4}>
                            <div className="info-group-column">
                              <div className="label">Requested By: </div>
                              <div className="value">
                                {selected_record?.prefix}{" "}
                                {selected_record?.first_name}{" "}
                                {selected_record?.middle_name}{" "}
                                {selected_record?.last_name}{" "}
                                {selected_record?.suffix}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={1}>
                            <div className="info-group-column">
                              <div className="label">Gender: </div>
                              <div className="value">
                                {selected_record.gender === "m" && "Male"}
                                {selected_record.gender === "f" && "Female"}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={3}>
                            <div className="info-group-column">
                              <div className="label">Email Address: </div>
                              <div className="value">
                                {selected_record.email}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={2}>
                            <div className="info-group-column">
                              <div className="label">Mobile Number: </div>
                              <div className="value">
                                {selected_record.mob_no}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={2}>
                            <div className="info-group-column">
                              <div className="label">Civil Status: </div>
                              <div className="value">
                                {selected_record.cs_desc}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={2}>
                            <div className="info-group-column">
                              <div className="label">Nationality: </div>
                              <div className="value">
                                {selected_record.nat_desc}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={2}>
                            <div className="info-group-column">
                              <div className="label">Religion: </div>
                              <div className="value">
                                {selected_record.rel_desc}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={6}>
                            <div className="info-group-column">
                              <div className="label">Complete Address: </div>
                              <div className="value">
                                {selected_record.line1} {selected_record.line2}{" "}
                                {selected_record.psgcaddress}{" "}
                                {selected_record.zip_code}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={2}>
                            <div className="info-group-column">
                              <div className="label">Current Status: </div>
                              <div className="value">
                                <Chip
                                  label={selected_record?.status?.sts_desc}
                                  style={{
                                    color: selected_record?.status?.sts_color,
                                    backgroundColor:
                                      selected_record?.status?.sts_bg_color,
                                  }}
                                />
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={3}>
                            <div className="info-group-column">
                              <div className="label">Requested On: </div>
                              <div className="value">
                                {InvalidDateTimeToDefault(
                                  selected_record?.request_at,
                                  "TBD"
                                )}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={3}>
                            <div className="info-group-column">
                              <div className="label">Paid On: </div>
                              <div className="value">
                                {InvalidDateTimeToDefault(
                                  selected_record?.pay_at,
                                  "TBD"
                                )}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={3}>
                            <div className="info-group-column">
                              <div className="label">Consulted On: </div>
                              <div className="value">
                                {InvalidDateTimeToDefault(
                                  selected_record?.consult_at,
                                  "TBD"
                                )}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={3}>
                            <div className="info-group-column">
                              <div className="label">Finished On: </div>
                              <div className="value">
                                {InvalidDateTimeToDefault(
                                  selected_record?.ended_at,
                                  "TBD"
                                )}
                              </div>
                            </div>
                          </Grid>

                          <Grid item xs={12} md={4} lg={3}>
                            <div className="info-group-column">
                              <div className="label">Consultation Cost: </div>
                              <div className="value">
                                <Chip
                                  label={
                                    <>
                                      &#8369;{" "}
                                      {HelpNumber.NumberToMoney(
                                        selected_record?.consult_cost
                                      )}{" "}
                                    </>
                                  }
                                />
                                {user_type === "admin" &&
                                  selected_record.sts_pk === "fa" && (
                                    <Tooltip title="Change the consultation cost">
                                      <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => {
                                          set_open_change_consult_cost_dialog(
                                            true
                                          );
                                        }}
                                      >
                                        <EditRoundedIcon
                                          fontSize="small"
                                          color="primary"
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                              </div>
                            </div>
                          </Grid>

                          <Grid item xs={12} md={4} lg={3}>
                            <div className="info-group-column">
                              <div className="label">Hospital #: </div>
                              <div className="value">
                                <div>
                                  {StringEmptyToDefault(
                                    selected_record?.hospital_no,
                                    "To be decided"
                                  )}
                                </div>

                                {selected_record?.sts_pk === "pd" && (
                                  <Tooltip title="Map this consultation to a hospital number (Note: Only for patients that have admitted before)">
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => {
                                        set_open_map_consult_dialog(true);
                                      }}
                                    >
                                      <EditRoundedIcon
                                        fontSize="small"
                                        color="primary"
                                      />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </div>
                            </div>
                          </Grid>

                          <Grid item xs={12}>
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={6}>
                                <div className="info-group-column">
                                  <div className="label">Chief Complaint: </div>
                                  <div className="value">
                                    {selected_record.chief_complaint}
                                  </div>
                                </div>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <div className="info-group-column">
                                  <div className="label">Symptoms: </div>
                                  <div className="value">
                                    {selected_record.symptoms}
                                  </div>
                                </div>
                              </Grid>
                            </Grid>
                          </Grid>

                          {/* <Grid item xs={12}>
                            <div className="separator"></div>
                          </Grid> */}
                          <Grid item xs={12} md={3}>
                            <div className="info-group-column">
                              <div className="label">Assigned Department: </div>

                              {StringEmptyToDefault(
                                selected_record?.assign_dept_desc,
                                "To be decided"
                              )}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <div className="info-group-column">
                              <div className="label">Assigned Doctor: </div>
                              {StringEmptyToDefault(
                                selected_record?.assign_res_desc,
                                "To be decided"
                              )}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <div className="info-group-column">
                              <div className="label ">
                                Expected Consult. Date:{" "}
                              </div>
                              <div className="value">
                                {InvalidDateToDefault(
                                  selected_record?.assign_dept_consult_date,
                                  "To be decided"
                                )}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <div className="info-group-column">
                              <div className="label ">Assigned Dept. On: </div>
                              <div className="value">
                                {InvalidDateTimeToDefault(
                                  selected_record?.assign_dept_at,
                                  "To be decided"
                                )}
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>

                {/* <Grid item xs={12}>
                  <div className="panel-container">
                    <ConsultRoom selected_row={selected_record} />
                  </div>
                </Grid> */}

                <Grid item xs={12}>
                  <div className="panel-container">
                    {!!selected_record?.consult_req_pk && !!user_type && (
                      <LinkTabs tabs={GenerateTabLinks()} />
                    )}
                  </div>
                </Grid>
              </Grid>

              {!!selected_record?.consult_req_pk && open_decline_dialog && (
                <DialogDeclineConsultReq
                  open={open_decline_dialog}
                  handleCloseDialog={() => {
                    set_open_decline_dialog(false);
                  }}
                  successCallback={() => {
                    handleReloadRecord();
                  }}
                  consult_req_pk={selected_record.consult_req_pk}
                />
              )}

              {!!selected_record?.consult_req_pk && open_assign_dept_dialog && (
                <DialogAssignConsultDept
                  open={open_assign_dept_dialog}
                  handleCloseDialog={() => {
                    set_open_assign_dept_dialog(false);
                  }}
                  successCallback={() => {
                    handleReloadRecord();
                  }}
                  selected_consultation={selected_record}
                />
              )}

              {!!selected_record?.consult_req_pk &&
                open_change_consult_cost_dialog && (
                  <DialogChangeConsultCost
                    open={open_change_consult_cost_dialog}
                    handleCloseDialog={() => {
                      set_open_change_consult_cost_dialog(false);
                    }}
                    successCallback={() => {
                      handleReloadRecord();
                    }}
                    selected_consultation={selected_record}
                  />
                )}

              {!!selected_record?.consult_req_pk && open_map_consult_dialog && (
                <DialogMapConsultPatient
                  open={open_map_consult_dialog}
                  handleCloseDialog={() => {
                    set_open_map_consult_dialog(false);
                  }}
                  successCallback={() => {
                    handleReloadRecord();
                  }}
                  selected_record={selected_record}
                />
              )}

              {!!selected_record?.consult_req_pk && open_start_consult_dialog && (
                <DialogStartConsult
                  open={open_start_consult_dialog}
                  handleCloseDialog={() => {
                    set_open_start_consult_dialog(false);
                  }}
                  successCallback={() => {
                    handleReloadRecord();
                  }}
                  selected_record={selected_record}
                />
              )}

              {!!preview_soa && (
                <PreviewPDF
                  file={preview_soa}
                  doc_title={`SOA-${selected_record?.consult_req_pk}.pdf`}
                  handleClose={() => {
                    set_preview_soa(null);
                  }}
                  actions={
                    <>
                      <Tooltip title="Email this document to the patient.">
                        <Badge
                          badgeContent={selected_record.soa_sent_count}
                          color="secondary"
                        >
                          <IconButton
                            className="btn-pdf-preview"
                            onClick={() => {
                              handleEmailSoa();
                            }}
                          >
                            <EmailRoundedIcon />
                          </IconButton>
                        </Badge>
                      </Tooltip>
                    </>
                  }
                />
              )}

              {!!preview_med_presc && (
                <PreviewPDF
                  file={preview_med_presc}
                  doc_title={`Medical-Prescription-${selected_record?.consult_req_pk}.pdf`}
                  handleClose={() => {
                    set_preview_med_presc(null);
                  }}
                  actions={
                    <>
                      <Tooltip title="Email this document to the patient.">
                        <Badge
                          badgeContent={selected_record.med_pres_sent}
                          color="secondary"
                        >
                          <IconButton
                            className="btn-pdf-preview"
                            onClick={() => {
                              handleEmailMedPrescrip();
                            }}
                          >
                            <EmailRoundedIcon />
                          </IconButton>
                        </Badge>
                      </Tooltip>
                    </>
                  }
                />
              )}

              {!!preview_proc_presc && (
                <PreviewPDF
                  file={preview_proc_presc}
                  doc_title={`Procedure-Prescription-${selected_record?.consult_req_pk}.pdf`}
                  handleClose={() => {
                    set_preview_proc_presc(null);
                  }}
                  actions={
                    <>
                      <Tooltip title="Email this document to the patient.">
                        <Badge
                          badgeContent={selected_record.proc_pres_sent}
                          color="secondary"
                        >
                          <IconButton
                            className="btn-pdf-preview"
                            onClick={() => {
                              handleEmailProcPrescrip();
                            }}
                          >
                            <EmailRoundedIcon />
                          </IconButton>
                        </Badge>
                      </Tooltip>
                    </>
                  }
                />
              )}
            </Container>
          )
        )
      ) : (
        <BodyLoader />
      )}
    </>
  );
});

export default ManageConsultReqView;
