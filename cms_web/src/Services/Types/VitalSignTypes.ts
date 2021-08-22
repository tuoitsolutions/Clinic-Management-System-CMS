import { VitalSignModel } from "../Models/VitalSignModel";

export type VitalSignReducerTypes =
  | {
      type: "set_pat_vital_sign";
      pat_vital_sign: VitalSignModel;
    }
  | {
      type: "set_fetch_pat_vital_sign";
      fetch_pat_vital_sign: boolean;
    };

export interface VitalSignReducerModel {
  pat_vital_sign?: VitalSignModel;
  fetch_pat_vital_sign: boolean;
}
