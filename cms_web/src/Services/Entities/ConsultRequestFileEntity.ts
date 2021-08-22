interface ConsultRequestFileEntity {
  cr_file_pk?: number;
  consult_req_pk?: string;
  file_dest?: string;
  file_name?: string;
  encoded_at?: Date;
}

export interface ConsultRequestFileTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<ConsultRequestFileEntity>;
}

export default ConsultRequestFileEntity;
