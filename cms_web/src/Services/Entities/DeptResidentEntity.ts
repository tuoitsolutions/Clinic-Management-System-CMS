import DepartmentEntity from "./DepartmentEntity";
import HospResidentEntity from "./HospResidentEntity";

interface DeptResidentEntity {
  dept_res_pk?: number;
  dept_pk?: number;
  res_pk?: number;
  notes?: string;
  is_active?: "y" | "n";
  encoded_at?: Date;
  encoder_pk?: string;

  department?: DepartmentEntity;
  hosp_res?: HospResidentEntity;
}

export interface DeptResidentTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<DeptResidentEntity>;
}

export default DeptResidentEntity;
