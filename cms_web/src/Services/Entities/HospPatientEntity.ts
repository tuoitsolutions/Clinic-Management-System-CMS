interface HospPatientEntity {
  hospital_no?: string;
  user_pk?: string;
  pic_dest?: string;
  prefix?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  birth_date?: string | Date;
  birth_place?: string;
  cs_pk?: number;
  nat_pk?: number;
  rel_pk?: number;
  email?: string;
  mob_no?: string;
  line1?: string;
  line2?: string;
  brgy_pk?: number;
  citymun_pk?: number;
  prov_pk?: number;
  region_pk?: string;
  zip_code?: string;
  consult_count?: number;
  last_consult_at?: string | Date;
  last_updated_at?: string | Date;
  last_updated_by?: string;

  //props as params
  consult_req_pk?: string;
}

export interface HospPatientTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<HospPatientEntity>;
}

export default HospPatientEntity;
