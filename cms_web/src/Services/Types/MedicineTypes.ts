import { MedicineModel } from "../Models/MedicineModel";

export type MedicineReducerTypes =
  | {
      type: "set_tbl_pat_medicine";
      tbl_pat_medicine: Array<MedicineModel>;
    }
  | {
      type: "set_fetch_tbl_pat_medicine";
      fetch_tbl_pat_medicine: boolean;
    };

export interface MedicineReducerModel {
  tbl_pat_medicine?: Array<MedicineModel>;
  fetch_tbl_pat_medicine: boolean;
}
