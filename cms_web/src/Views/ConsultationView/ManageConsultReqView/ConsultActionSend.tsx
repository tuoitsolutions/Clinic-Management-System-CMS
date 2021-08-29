import { Badge, IconButton, Tooltip } from "@material-ui/core";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import React, { FC, memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ButtonPopper from "../../../Component/ButtonPopper";
import PreviewPDF from "../../../Component/PreviewPDF";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultMedApi from "../../../Services/Api/ConsultMedApi";
import ConsultProcApi from "../../../Services/Api/ConsultProcApi";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import DialogComposeConsultEmail from "./DialogConsultComposeEmail";
import DialogComposeConsultSms from "./DialogConsultComposeSms";

interface IConsultActionSend {
  consult_info: ConsultRequestEntity;
  handleReloadRecord: () => void;
}

const ConsultActionSend: FC<IConsultActionSend> = memo(
  ({ consult_info, handleReloadRecord }) => {
    const params = useParams();
    const dispatch = useDispatch();
    console.log(`params`, params);

    const [preview_soa, set_preview_soa] = useState("");
    const [preview_med_presc, set_preview_med_presc] = useState("");
    const [preview_proc_presc, set_preview_proc_presc] = useState("");

    const [open_sms_compose_dialog, set_open_sms_compose_dialog] =
      useState(false);
    const [open_email_compose_dialog, set_open_email_compose_dialog] =
      useState(false);

    const handlePreviewSoa = useCallback(async () => {
      if (!!consult_info?.consult_req_pk) {
        dispatch(
          showPageLoading({
            show: true,
            loading_message:
              "Loading Statement of account (SOA), thank you for your patience",
          })
        );
        const response = await ConsultRequestApi.PreviewConsultSoa(
          consult_info?.consult_req_pk
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
    }, [dispatch, consult_info]);

    const handlePreviewMedPrescrip = useCallback(async () => {
      if (!!consult_info?.consult_req_pk) {
        dispatch(
          showPageLoading({
            show: true,
            loading_message:
              "Loading Medical Prescription, thank you for your patience",
          })
        );
        const response = await ConsultMedApi.PreviewMedPrescrip(
          consult_info?.consult_req_pk
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
    }, [dispatch, consult_info]);

    const handlePreviewProcPrescrip = useCallback(async () => {
      if (!!consult_info?.consult_req_pk) {
        dispatch(
          showPageLoading({
            show: true,
            loading_message:
              "Loading Procedure Prescription, thank you for your patience",
          })
        );
        const response = await ConsultProcApi.PreviewProcPrescrip(
          consult_info?.consult_req_pk
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
    }, [dispatch, consult_info]);

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
              consult_info?.consult_req_pk
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
    }, [dispatch, handleReloadRecord, consult_info]);

    const handleEmailSoa = useCallback(async () => {
      if (!!preview_soa && !!consult_info?.consult_req_pk) {
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
                consult_req_pk: consult_info?.consult_req_pk,
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
    }, [dispatch, handleReloadRecord, preview_soa, consult_info]);

    const handleEmailMedPrescrip = useCallback(async () => {
      if (!!preview_med_presc && !!consult_info?.consult_req_pk) {
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
                consult_req_pk: consult_info?.consult_req_pk,
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
    }, [dispatch, handleReloadRecord, preview_med_presc, consult_info]);

    const handleEmailProcPrescrip = useCallback(async () => {
      if (!!preview_proc_presc && !!consult_info?.consult_req_pk) {
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
                consult_req_pk: consult_info?.consult_req_pk,
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
    }, [dispatch, handleReloadRecord, preview_proc_presc, consult_info]);

    return (
      <>
        <ButtonPopper
          actionLabel="Send"
          variant="contained"
          buttonColor="primary"
          buttons={[
            {
              text: `Payment Link`,
              disabled: consult_info?.sts_pk !== "fa",
              badge_value: consult_info?.pay_link_sent_count,
              handleClick: () => {
                handleSendPaymentLink();
              },
            },
            {
              text: "Statement of Account (SOA)",
              handleClick: () => {
                handlePreviewSoa();
              },
            },
            {
              text: "Medical Request",
              handleClick: () => {
                handlePreviewMedPrescrip();
              },
            },
            {
              text: "Procedure Prescription",
              handleClick: () => {
                handlePreviewProcPrescrip();
              },
            },
            {
              text: "SMS",
              handleClick: () => {
                console.log(`..`);
                set_open_sms_compose_dialog(true);
              },
            },
            {
              text: "Email",
              handleClick: () => {
                set_open_email_compose_dialog(true);
              },
            },
          ]}
        />

        {!!preview_soa && (
          <PreviewPDF
            file={preview_soa}
            doc_title={`SOA-${consult_info?.consult_req_pk}.pdf`}
            handleClose={() => {
              set_preview_soa(null);
            }}
            actions={
              <>
                <Tooltip title="Email this document to the patient.">
                  <Badge
                    badgeContent={consult_info?.soa_sent_count}
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
            doc_title={`Medical-Prescription-${consult_info?.consult_req_pk}.pdf`}
            handleClose={() => {
              set_preview_med_presc(null);
            }}
            actions={
              <>
                <Tooltip title="Email this document to the patient.">
                  <Badge
                    badgeContent={consult_info?.med_pres_sent}
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
            doc_title={`Procedure-Prescription-${consult_info?.consult_req_pk}.pdf`}
            handleClose={() => {
              set_preview_proc_presc(null);
            }}
            actions={
              <>
                <Tooltip title="Email this document to the patient.">
                  <Badge
                    badgeContent={consult_info?.proc_pres_sent}
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

        {!!consult_info?.consult_req_pk && open_sms_compose_dialog && (
          <DialogComposeConsultSms
            open={open_sms_compose_dialog}
            handleCloseDialog={() => {
              set_open_sms_compose_dialog(false);
            }}
            successCallback={() => {
              //handleReloadRecord();
            }}
            consult_req_pk={consult_info?.consult_req_pk}
          />
        )}

        {!!consult_info?.consult_req_pk && open_email_compose_dialog && (
          <DialogComposeConsultEmail
            open={open_email_compose_dialog}
            handleCloseDialog={() => {
              set_open_email_compose_dialog(false);
            }}
            successCallback={() => {
              //handleReloadRecord();
            }}
            consult_req_pk={consult_info?.consult_req_pk}
          />
        )}
      </>
    );
  }
);

export default ConsultActionSend;
