using pos_server.Entities;
using System;

namespace cms_server.Entities
{
    public class ConsultReqTranLogEntity
    {
        public int? cr_tran_log_pk { get; set; }
        public string consult_req_pk { get; set; }
        public string dept_pk_from { get; set; }
        public string dept_pk_to { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoded_by { get; set; }

        //ext
        public string dept_desc_from { get; set; }
        public string dept_desc_to { get; set; }
        public UserEntity user_info { get; set; }
    }
}
