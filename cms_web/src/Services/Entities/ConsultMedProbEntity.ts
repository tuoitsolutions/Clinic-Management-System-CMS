interface ConsultMedProbEntity {
  cr_med_prob_pk?: number;
  consult_req_pk?: string;
  med_prob_pk?: string;
  med_prob_desc?: string;
  med_prob_host?: string;
  is_active?: "y" | "n";
  encoded_at?: string | Date;
  encoder_pk?: string;
}

export interface ConsultMedProbTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<ConsultMedProbEntity>;
}

export default ConsultMedProbEntity;
