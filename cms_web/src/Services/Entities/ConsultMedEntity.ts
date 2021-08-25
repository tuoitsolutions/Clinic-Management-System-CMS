interface ConsultMedEntity {
  cr_med_pk?: number;
  consult_req_pk?: string;
  med_no?: string;
  med_desc?: string;
  unit?: string;
  dosage?: string;
  is_active?: string;
  encoded_at?: string | Date;
  encoder_pk?: string;

  //
  attach_file?: string;
}

export interface ConsultMedTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<ConsultMedEntity>;
}

export default ConsultMedEntity;
