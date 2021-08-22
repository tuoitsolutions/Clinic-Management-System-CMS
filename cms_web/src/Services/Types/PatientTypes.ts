import { PatientModel } from "../Models/PatientModel";

export type PatientReducerTypes =
  | {
      type: "set_tbl_admitted_pat";
      tbl_admitted_pat: PatDataTable;
    }
  | {
      type: "set_fetch_tbl_admitted_pat";
      fetch_tbl_admitted_pat: boolean;
    }
  | {
      type: "set_tbl_discharged_pat";
      tbl_discharged_pat: PatDataTable;
    }
  | {
      type: "set_fetch_tbl_discharged_pat";
      fetch_tbl_discharged_pat: boolean;
    }
  | {
      type: "set_tbl_outpatient";
      tbl_outpatient: PatDataTable;
    }
  | {
      type: "set_fetch_tbl_outpatient";
      fetch_tbl_outpatient: boolean;
    }
  | {
      type: "set_single_pat";
      single_pat: PatientModel;
    }
  | {
      type: "set_fetch_single_pat";
      fetch_single_pat: boolean;
    };

export interface PatientReducerModel {
  tbl_admitted_pat?: PatDataTable;
  fetch_tbl_admitted_pat: boolean;
  tbl_discharged_pat?: PatDataTable;
  fetch_tbl_discharged_pat: boolean;
  tbl_outpatient?: PatDataTable;
  fetch_tbl_outpatient: boolean;
  single_pat?: PatientModel;
  fetch_single_pat: boolean;
}

interface PatDataTable {
  limit: number;
  count: number;
  begin: number;
  table: Array<PatientModel>;
}
