import { Dispatch } from "react";
import { ConsultRequestReducerTypes } from "../Types/ConsultRequestTypes";

const SetOpenTransferDeptDialog =
  (is_open: boolean) =>
  async (dispatch: Dispatch<ConsultRequestReducerTypes>) => {
    dispatch({
      type: "open_transfer_dept_dialog",
      open_transfer_dept_dialog: is_open,
    });
  };

const SetOpenSchedDialog =
  (is_open: boolean) =>
  async (dispatch: Dispatch<ConsultRequestReducerTypes>) => {
    dispatch({
      type: "open_sched_dialog",
      open_sched_dialog: is_open,
    });
  };

const SetOpenSyncPatDialog =
  (is_open: boolean) =>
  async (dispatch: Dispatch<ConsultRequestReducerTypes>) => {
    dispatch({
      type: "open_sync_pat_dialog",
      open_sync_pat_dialog: is_open,
    });
  };

const SetOpenAdjustCostDialog =
  (is_open: boolean) =>
  async (dispatch: Dispatch<ConsultRequestReducerTypes>) => {
    dispatch({
      type: "open_adjust_cost_dialog",
      open_adjust_cost_dialog: is_open,
    });
  };

const SetOpenUpdateDiagnosisDialog =
  (is_open: boolean) =>
  async (dispatch: Dispatch<ConsultRequestReducerTypes>) => {
    dispatch({
      type: "open_update_diagnosis_dialog",
      open_update_diagnosis_dialog: is_open,
    });
  };

export default {
  SetOpenTransferDeptDialog,
  SetOpenSchedDialog,
  SetOpenSyncPatDialog,
  SetOpenAdjustCostDialog,
  SetOpenUpdateDiagnosisDialog,
};
