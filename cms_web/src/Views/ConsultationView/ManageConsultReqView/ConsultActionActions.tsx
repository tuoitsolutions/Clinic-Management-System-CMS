import React, { FC, memo, useState } from "react";
import ButtonPopper from "../../../Component/ButtonPopper";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import DialogChangeConsultCost from "./DialogChangeConsultCost";
import DialogConsultSetEstSched from "./DialogConsultSetEstSched";
import DialogMapConsultPatient from "./DialogConsultSyncPat";
import DialogConsultTransferDept from "./DialogConsultTransferDept";

interface IConsultActionActions {
  consult_info: ConsultRequestEntity;
  handleReloadRecord: () => void;
}

const ConsultActionActions: FC<IConsultActionActions> = memo(
  ({ consult_info, handleReloadRecord }) => {
    const [open_tranfers_dept_dialog, set_open_tranfers_dept_dialog] =
      useState(false);

    const [open_set_est_sched_dialog, set_open_set_est_sched_dialog] =
      useState(false);

    const [
      open_change_consult_cost_dialog,
      set_open_change_consult_cost_dialog,
    ] = useState(false);

    const [open_sync_consult_dialog, set_open_sync_consult_dialog] =
      useState(false);

    return (
      <>
        <ButtonPopper
          actionLabel="Actions"
          variant="contained"
          buttonColor="primary"
          buttons={[
            {
              text: `Adjust Consultation Cost`,
              disabled: consult_info?.sts_pk !== "fa",
              handleClick: () => {
                set_open_change_consult_cost_dialog(true);
              },
            },
            {
              text: `Sync Consult Records`,
              handleClick: () => {
                set_open_sync_consult_dialog(true);
              },
            },
            {
              text: `Set Department and Resident`,
              handleClick: () => {
                set_open_tranfers_dept_dialog(true);
              },
            },
            {
              text: `Set Estimated Start Schedule`,
              handleClick: () => {
                set_open_set_est_sched_dialog(true);
              },
            },
          ]}
        />

        {!!consult_info?.consult_req_pk && open_change_consult_cost_dialog && (
          <DialogChangeConsultCost
            open={open_change_consult_cost_dialog}
            handleCloseDialog={() => {
              set_open_change_consult_cost_dialog(false);
            }}
            successCallback={() => {
              handleReloadRecord();
            }}
            selected_consultation={consult_info}
          />
        )}

        {!!consult_info?.consult_req_pk && open_tranfers_dept_dialog && (
          <DialogConsultTransferDept
            open={open_tranfers_dept_dialog}
            handleCloseDialog={() => {
              set_open_tranfers_dept_dialog(false);
            }}
            successCallback={() => {
              handleReloadRecord();
            }}
            selected_consultation={consult_info}
          />
        )}

        {open_set_est_sched_dialog && (
          <DialogConsultSetEstSched
            open={open_set_est_sched_dialog}
            handleCloseDialog={() => {
              set_open_set_est_sched_dialog(false);
            }}
            successCallback={() => {
              handleReloadRecord();
            }}
            selected_consultation={consult_info}
          />
        )}

        {!!consult_info?.consult_req_pk && open_sync_consult_dialog && (
          <DialogMapConsultPatient
            open={open_sync_consult_dialog}
            handleCloseDialog={() => {
              set_open_sync_consult_dialog(false);
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

export default ConsultActionActions;
