import { PhysicalExamModel } from "../Models/PhysicalExamModel";

export type PhysicalExamReducerTypes =
  | {
      type: "set_tbl_pat_physical_exam";
      tbl_pat_physical_exam: Array<PhysicalExamModel>;
    }
  | {
      type: "set_fetch_tbl_pat_physical_exam";
      fetch_tbl_pat_physical_exam: boolean;
    };

export interface PhysicalExamReducerModel {
  tbl_pat_physical_exam?: Array<PhysicalExamModel>;
  fetch_tbl_pat_physical_exam: boolean;
}
