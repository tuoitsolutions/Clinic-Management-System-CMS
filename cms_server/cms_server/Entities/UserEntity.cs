using System;

namespace pos_server.Entities
{
    public class UserEntity
    {
        public string user_pk { get; set; }
        public string username { get; set; }
        public string full_name { get; set; }
        public string user_type { get; set; }
        public string clinic_pk { get; set; }
        public string dept_pk { get; set; }
        public string pass { get; set; }
        public string sts_pk { get; set; }
        public string is_active { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoder_pk { get; set; }

        //others
        public string user_sub { get; set; }

    }
}
