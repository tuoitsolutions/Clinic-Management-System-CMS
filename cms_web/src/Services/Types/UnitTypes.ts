import UnitEntity from "../Entities/AdminEntity";

export type UnitReducerTypes =
  | {
      type: "unit_table";
      unit_table: UnitTableModel;
    }
  | {
      type: "fetch_unit_table";
      fetch_unit_table: boolean;
    }
  | {
      type: "err_unit_table";
      err_unit_table: boolean;
    }
  //
  | {
      type: "selected_unit";
      selected_unit: UnitEntity;
    }
  | {
      type: "fetch_selected_unit";
      fetch_selected_unit: boolean;
    }
  | {
      type: "err_selected_unit";
      err_selected_unit: boolean;
    };

export interface UnitReducerModel {
  unit_table?: UnitTableModel;
  fetch_unit_table?: boolean;
  err_unit_table?: string;
  //
  selected_unit?: UnitEntity;
  fetch_selected_unit?: boolean;
  err_selected_unit: boolean;
}

interface UnitTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<UnitEntity>;
}
