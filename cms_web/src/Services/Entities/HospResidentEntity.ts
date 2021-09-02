interface HospResidentEntity {
  res_pk?: number;
  user_pk?: number;
  license_no?: string;
  dept_pk?: string;
  spclty_pk?: string;
  pic_dest?: string;
  doc_title?: string;
  prefix?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  suffix?: string;
  gender?: "m" | "f";
  bio?: string;
  email?: string;
  mob_no?: string;
  is_active?: "y" | "n";
  encoded_at?: Date;
  encoder_pk?: string;
  esignature?: string;
  //ext
  res_name?: string;
  dept_name?: string;
  img_attach?: any;
  specialty?: string;
  total_consult?: string;
}

export interface HospResidentTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<HospResidentEntity>;
}

export default HospResidentEntity;
