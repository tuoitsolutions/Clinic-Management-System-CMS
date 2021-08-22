import { PertinentModel } from "../Models/PertinentModel";

export type PertinentReducerTypes =
  | {
      type: "set_tbl_pat_pertinent";
      tbl_pat_pertinent: Array<PertinentModel>;
    }
  | {
      type: "set_fetch_tbl_pat_pertinent";
      fetch_tbl_pat_pertinent: boolean;
    };

export interface PertinentReducerModel {
  tbl_pat_pertinent?: Array<PertinentModel>;
  fetch_tbl_pat_pertinent: boolean;
}
