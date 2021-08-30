import React, { FC, memo, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ButtonPopper from "../../../Component/ButtonPopper";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import DialogChangeConsultCost from "./DialogChangeConsultCost";
import DialogAssignConsultDept from "./DialogConsultSetSchedDept";
import DialogMapConsultPatient from "./DialogConsultSyncPat";

interface IConsultActionActions {
  consult_info: ConsultRequestEntity;
  handleReloadRecord: () => void;
}

const ConsultActionActions: FC<IConsultActionActions> = memo(
  ({ consult_info, handleReloadRecord }) => {
    const [open_assign_dept_dialog, set_open_assign_dept_dialog] =
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
              text: `Set & Schedule Department`,
              handleClick: () => {
                set_open_assign_dept_dialog(true);
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

        {!!consult_info?.consult_req_pk && open_assign_dept_dialog && (
          <DialogAssignConsultDept
            open={open_assign_dept_dialog}
            handleCloseDialog={() => {
              set_open_assign_dept_dialog(false);
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
