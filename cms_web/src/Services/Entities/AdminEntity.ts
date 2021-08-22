interface AdminEntity {
  admin_pk?: number;
  user_pk?: number;
  emp_id?: string;
  pic_dest?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  suffix?: string;
  gender?: "m" | "f";
  position?: string;
  email?: string;
  mob_no?: string;
  is_active?: "y" | "n";
  encoded_at?: Date;
  encoded_by?: string;

  //ext
  img_attach?: any;
}

export interface AdminTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<AdminEntity>;
}

export default AdminEntity;
