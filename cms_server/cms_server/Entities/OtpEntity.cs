using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Entities
{
    public class OtpEntity
    {
        public int otp_pk { get; set; }
        public string user_pk { get; set; }
        public string mob_no { get; set; }
        public string otp_code { get; set; }
        public int expire_sec { get; set; }
        public string is_verified { get; set; }
        public DateTime encoded_at { get; set; }
        public string consult_req_pk { get; set; }
    }
}
