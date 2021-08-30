import React, { FC, memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ButtonPopper from "../../../Component/ButtonPopper";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import DialogDeclineConsultReq from "./DialogConsultDeclineReq";
import DialogStartConsult from "./DialogConsultStartReq";
import DialogUndeclineConsult from "./DialogConsultUndeclineReq";

interface IConsultActionStatus {
  consult_info: ConsultRequestEntity;
  handleReloadRecord: () => void;
}

const ConsultActionStatus: FC<IConsultActionStatus> = memo(
  ({ consult_info, handleReloadRecord }) => {
    const params = useParams();
    const dispatch = useDispatch();
    const [open_decline_dialog, set_open_decline_dialog] = useState(false);
    const [open_undecline_dialog, set_open_undecline_dialog] = useState(false);

    const [open_start_consult_dialog, set_open_start_consult_dialog] =
      useState(false);

    const handleSetConsultAsPaid = useCallback(async () => {
      if (!!consult_info?.consult_req_pk) {
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to manually set this consultatio as paid?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message:
                    "Setting consultation status to paid, thank you for your patience",
                })
              );
              const response = await ConsultRequestApi.SetConsultAsPaid({
                consult_req_pk: consult_info?.consult_req_pk,
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
    }, [dispatch, handleReloadRecord, consult_info]);

    const handleEndConsultation = useCallback(async () => {
      if (!!consult_info?.consult_req_pk) {
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
                consult_req_pk: consult_info?.consult_req_pk,
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
    }, [dispatch, handleReloadRecord, consult_info]);

    return (
      <>
        <ButtonPopper
          actionLabel="Status"
          variant="contained"
          buttonColor="primary"
          buttons={[
            {
              text: `Decline Consultation`,
              disabled: consult_info?.sts_pk !== "fa",
              handleClick: () => {
                set_open_decline_dialog(true);
              },
            },
            {
              text: `Undecline Consultation`,
              disabled: consult_info?.sts_pk !== "x",
              handleClick: () => {
                set_open_undecline_dialog(true);
              },
            },
            {
              text: `Manually Set As Paid`,
              disabled: consult_info?.sts_pk !== "fa",
              handleClick: () => {
                handleSetConsultAsPaid();
              },
            },
            {
              text: `Start Consultation`,
              disabled: consult_info?.sts_pk !== "pd",
              handleClick: () => {
                set_open_start_consult_dialog(true);
              },
            },
            {
              text: `End Consultation`,
              disabled: consult_info?.sts_pk !== "s",
              handleClick: () => {
                handleEndConsultation();
              },
            },
          ]}
        />

        {!!consult_info?.consult_req_pk && open_decline_dialog && (
          <DialogDeclineConsultReq
            open={open_decline_dialog}
            handleCloseDialog={() => {
              set_open_decline_dialog(false);
            }}
            successCallback={() => {
              handleReloadRecord();
            }}
            consult_req_pk={consult_info?.consult_req_pk}
          />
        )}

        {!!consult_info?.consult_req_pk && open_undecline_dialog && (
          <DialogUndeclineConsult
            open={open_undecline_dialog}
            handleCloseDialog={() => {
              set_open_undecline_dialog(false);
            }}
            successCallback={() => {
              handleReloadRecord();
            }}
            consult_req_pk={consult_info?.consult_req_pk}
          />
        )}

        {!!consult_info?.consult_req_pk && open_start_consult_dialog && (
          <DialogStartConsult
            open={open_start_consult_dialog}
            handleCloseDialog={() => {
              set_open_start_consult_dialog(false);
            }}
            successCallback={() => {
              handleReloadRecord();
            }}
            selected_record={consult_info}
          />
        )}
      </>
    );
  }
);

export default ConsultActionStatus;
