interface ConsultProcEntity {
  cr_proc_pk?: number;
  consult_req_pk?: string;
  proc_no?: string;
  proc_desc?: string;
  reg_price?: number;
  notes?: string;
  is_active?: "y" | "n";
  encoded_at?: string | Date;
  encoder_pk?: string;
}

export interface ConsultProcTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<ConsultProcEntity>;
}

export default ConsultProcEntity;
