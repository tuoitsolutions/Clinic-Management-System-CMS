import React, { FC, memo, useState } from "react";
import { useDispatch } from "react-redux";
import ButtonPopper from "../../../Component/ButtonPopper";
import ConsultRequestActions from "../../../Services/Actions/ConsultRequestActions";
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
    const dispatch = useDispatch();

    return (
      <>
        <ButtonPopper
          actionLabel="Actions"
          variant="contained"
          buttonColor="primary"
          buttons={[
            // {
            //   text: `Adjust Consultation Cost`,
            //   disabled: consult_info?.sts_pk !== "fa",
            //   handleClick: () => {
            //     dispatch(ConsultRequestActions.SetOpenAdjustCostDialog(true));
            //   },
            // },
            {
              disabled:
                consult_info?.sts_pk !== "pd" &&
                consult_info.sts_pk !== "fa" &&
                consult_info.sts_pk !== "s" &&
                consult_info.sts_pk !== "e",
              text: `Sync Consult Records`,
              handleClick: () => {
                dispatch(ConsultRequestActions.SetOpenSyncPatDialog(true));
              },
            },
            {
              disabled:
                consult_info?.sts_pk !== "pd" && consult_info.sts_pk !== "fa",
              text: `Transfer to Other Department`,
              handleClick: () => {
                dispatch(ConsultRequestActions.SetOpenTransferDeptDialog(true));
              },
            },
            {
              disabled:
                consult_info?.sts_pk !== "pd" && consult_info.sts_pk !== "fa",
              text: `Set Estimated Start Schedule`,
              handleClick: () => {
                dispatch(ConsultRequestActions.SetOpenSchedDialog(true));
              },
            },
          ]}
        />

        {!!consult_info?.consult_req_pk && (
          <DialogChangeConsultCost
            successCallback={() => {
              handleReloadRecord();
            }}
            selected_consultation={consult_info}
          />
        )}

        {!!consult_info?.consult_req_pk && (
          <DialogConsultTransferDept
            successCallback={() => {
              handleReloadRecord();
            }}
            selected_consultation={consult_info}
          />
        )}

        {!!consult_info && (
          <DialogConsultSetEstSched
            successCallback={() => {
              handleReloadRecord();
            }}
            selected_consultation={consult_info}
          />
        )}

        {!!consult_info?.consult_req_pk && (
          <DialogMapConsultPatient
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
