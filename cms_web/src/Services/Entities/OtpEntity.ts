interface OtpEntity {
  otp_pk?: string;
  user_pk?: string;
  mob_no?: string;
  otp_code?: string;
  expire_sec?: string;
  is_verified?: string;
  consult_req_pk?: string;
  encoded_at?: Date | string;
}

export default OtpEntity;
