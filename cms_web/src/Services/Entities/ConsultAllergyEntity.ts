interface ConsultAllergyEntity {
  cr_allergy_pk?: number;
  consult_req_pk?: string;
  substance: string;
  reaction: string;
  first_occur: string;
  notes: string;
  is_active?: "y" | "n";
  encoded_at?: string | Date;
  encoder_pk?: string;
}

export interface ConsultAllergyTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<ConsultAllergyEntity>;
}

export default ConsultAllergyEntity;
