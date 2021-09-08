interface ConsultReqChatEntity {
  cr_chat_pk?: number;
  connection_id?: string;
  consult_req_pk?: string;
  cr_file_pk?: number;
  msg_body?: string;
  sent_at?: string;
  shown?: string;
  sender_pk?: string;
  sender_name?: string;
  user_type?: string;

  //
  attached_files?: Array<File>;
}

export default ConsultReqChatEntity;
