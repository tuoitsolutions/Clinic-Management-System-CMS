import UserEntity from "./UserEntity";

interface DepartmentEntity {
  dept_pk?: number;
  dept_code?: number;
  dept_name?: number;
  notes?: string;
  is_active?: "y" | "n";
  encoded_at?: Date;
  encoder_pk?: string;

  user?: UserEntity;
}

export interface DepartmentTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<DepartmentEntity>;
}

export default DepartmentEntity;
