interface UserEntity {
  user_pk?: number;
  username?: string;
  full_name?: string;
  user_type?: string;
  clinic_pk?: string;
  pass?: any;
  sts_pk?: string;
  is_active?: string;
  encoded_at?: Date;
  encoder_pk?: string;

  //ext
  user_sub?: string;
}

export default UserEntity;
