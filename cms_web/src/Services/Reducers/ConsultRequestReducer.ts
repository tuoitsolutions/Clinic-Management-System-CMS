import {
  ConsultRequestReducerModel,
  ConsultRequestReducerTypes,
} from "../Types/ConsultRequestTypes";

const defaultState: ConsultRequestReducerModel = {
  open_transfer_dept_dialog: false,
  open_sched_dialog: false,
  open_sync_pat_dialog: false,
  open_adjust_cost_dialog: false,
  open_update_diagnosis_dialog: false,
};

const ConsultRequestReducer = (
  state: ConsultRequestReducerModel = defaultState,
  action: ConsultRequestReducerTypes
): ConsultRequestReducerModel => {
  switch (action.type) {
    case "open_transfer_dept_dialog": {
      return {
        ...state,
        open_transfer_dept_dialog: action.open_transfer_dept_dialog,
      };
    }
    case "open_sched_dialog": {
      return {
        ...state,
        open_sched_dialog: action.open_sched_dialog,
      };
    }
    case "open_sync_pat_dialog": {
      return {
        ...state,
        open_sync_pat_dialog: action.open_sync_pat_dialog,
      };
    }
    case "open_adjust_cost_dialog": {
      return {
        ...state,
        open_adjust_cost_dialog: action.open_adjust_cost_dialog,
      };
    }
    case "open_update_diagnosis_dialog": {
      return {
        ...state,
        open_update_diagnosis_dialog: action.open_update_diagnosis_dialog,
      };
    }

    default:
      return state;
  }
};

export default ConsultRequestReducer;
