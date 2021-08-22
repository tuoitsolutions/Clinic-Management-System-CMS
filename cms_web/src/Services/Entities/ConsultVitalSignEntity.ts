interface ConsultVitalSignEntity {
  cr_vs_pk?: number;
  consult_req_pk?: string;
  blood_pressure?: string;
  heart_rate?: string;
  resp_rate?: string;
  temperature?: string;
  height?: string;
  weight?: string;
  bmi?: string;
  remarks?: string;
  is_valid?: "y" | "n";
  encoded_at?: string | Date;
  encoder_pk?: string;
}

export interface ConsultVitalSignTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<ConsultVitalSignEntity>;
}

export default ConsultVitalSignEntity;
