interface ConsultImmuneEntity {
  cr_immune_pk?: number;
  consult_req_pk?: string;
  vac_pk?: string;
  vac_desc?: string;
  vac_type?: string;
  date_given?: string | Date;
  next_dose?: string | Date;
  administered_by?: string;
  is_valid?: "y" | "n";
  encoded_at?: string | Date;
  encoder_pk?: string;
}

export interface ConsultImmuneTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<ConsultImmuneEntity>;
}

export default ConsultImmuneEntity;
