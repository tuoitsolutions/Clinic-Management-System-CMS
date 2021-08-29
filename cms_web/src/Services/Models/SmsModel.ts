interface SmsModel {
  message_to?: string;
  message_from?: string;
  message_text?: string;
  encoded_at?: string | Date;
  encoded_by?: string;
  consult_req_pk?: string;
}

export default SmsModel;
