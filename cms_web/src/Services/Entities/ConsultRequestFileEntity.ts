interface ConsultRequestFileEntity {
  cr_file_pk?: number;
  consult_req_pk?: string;
  file_dest?: string;
  file_name?: string;
  file_type?: string;
  notes?: string;
  is_active?: "y" | "n";
  encoded_at?: string | Date;
  encoded_by?: string;
  updated_at?: string | Date;
  updated_by?: string;
  attach_file?: FormData;
}

export interface ConsultRequestFileTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<ConsultRequestFileEntity>;
}

export default ConsultRequestFileEntity;
