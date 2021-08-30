import ConsultRequestFileEntity from "./ConsultRequestFileEntity";
import StatusMasterEntity from "./StatusMasterEntity";

interface ConsultRequestEntity {
  hash_key?: string;
  consult_req_pk?: string;
  hospital_no?: string;
  pic_dest?: string;
  prefix?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  suffix?: string;
  gender?: string;
  cs_pk?: string;
  nat_pk?: string;
  rel_pk?: string;
  birth_date?: Date | string;
  email?: string;
  mob_no?: string;
  chief_complaint?: string;
  symptoms?: string;
  notes?: string;
  line1?: string;
  line2?: string;
  brgy_pk?: string;
  prov_pk?: string;
  citymun_pk?: string;
  region_pk?: string;
  zip_code?: string;
  slip_pk?: string;
  tran_method?: string;
  discount_type?: string;
  discount_desc?: string;
  discount_rate?: string;
  discount_id_num?: string;
  discount_amount?: string;
  is_charity?: "y" | "n";
  is_agree_priv_pol?: "y" | "n";
  consult_cost?: number;
  request_at?: Date;
  accept_at?: Date;
  soa_sent_at?: Date;
  pay_at?: Date;
  consult_at?: Date;
  ended_at?: Date;
  sts_pk?: string;
  pay_sts_pk?: string;
  payment_method?: string;
  payment_receipt_no?: string;
  last_update_at?: string;
  last_update_by?: string;
  payment_source_id?: string;
  attach_req_files?: Array<File>;
  consult_req_file?: ConsultRequestFileEntity;
  otp_code?: string;
  pay_link_sent_count?: number;
  med_pres_sent?: number;
  proc_pres_sent?: number;
  soa_sent_count?: number;
  consult_link_sent_count?: number;
  paymongo_src_id?: string;
  paymongo_src_id_enc_at?: string | Date;
  paymongo_charge_at?: string | Date;
  paymongo_paid_at?: string | Date;
  assign_dept_pk?: string;
  assign_res_pk?: string;
  assign_dept_consult_date?: string;
  est_start_at?: string | Date;

  assign_dept_at?: string;
  consult_link_pass?: string;
  consult_link_hash?: string;
  //pk
  nat_desc?: string;
  rel_desc?: string;
  cs_desc?: string;
  citymundesc?: string;
  provincedesc?: string;
  barangaydesc?: string;
  regiondesc?: string;
  psgcaddress?: string;
  assign_dept_desc?: string;
  assign_res_desc?: string;

  status?: StatusMasterEntity;
  //others
  attach_base64_soa?: string;
  attach_profile_pic?: string | File;
  age?: string;
  start_date?: Date | string;
  start_time?: Date | string;
}

export interface ConsultRequestTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<ConsultRequestEntity>;
}

export interface SendMessagePayload {
  consult_req_pk?: string;
  body?: string;
  send_to_email?: boolean;
  send_to_sms?: boolean;
  send_to?: Array<string>;
}

export default ConsultRequestEntity;
