import UserEntity from "./UserEntity";

interface ConsultDeptTranLogEntity {
  cr_tran_log_pk?: number;
  consult_req_pk?: string;
  dept_pk_from?: string;
  dept_pk_to?: string;
  encoded_at?: string | Date;
  encoded_by?: string;
  dept_desc_from?: string;
  dept_desc_to?: string;
  user_info?: UserEntity;
}

export default ConsultDeptTranLogEntity;
