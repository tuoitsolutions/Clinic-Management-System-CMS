interface EmailModel {
  email_to?: string;
  email_body?: string;

  encoded_at?: string | Date;
  encoded_by?: string;
  consult_req_pk?: string;
}

export default EmailModel;
