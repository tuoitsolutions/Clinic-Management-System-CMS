export type ConsultRequestReducerTypes =
  | {
      type: "open_transfer_dept_dialog";
      open_transfer_dept_dialog: boolean;
    }
  | {
      type: "open_sched_dialog";
      open_sched_dialog: boolean;
    }
  | {
      type: "open_sync_pat_dialog";
      open_sync_pat_dialog: boolean;
    }
  | {
      type: "open_adjust_cost_dialog";
      open_adjust_cost_dialog: boolean;
    }
  | {
      type: "open_update_diagnosis_dialog";
      open_update_diagnosis_dialog: boolean;
    };

export interface ConsultRequestReducerModel {
  open_transfer_dept_dialog: boolean;
  open_sched_dialog: boolean;
  open_sync_pat_dialog: boolean;
  open_adjust_cost_dialog: boolean;
  open_update_diagnosis_dialog: boolean;
}
