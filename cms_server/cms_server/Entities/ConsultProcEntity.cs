using System;

namespace cms_server.Entities
{
    public class ConsultProcEntity
    {
        public int? cr_proc_pk { get; set; }
        public string consult_req_pk { get; set; }
        public string proc_no { get; set; }
        public string proc_desc { get; set; }
        public decimal? reg_price { get; set; }
        public string notes { get; set; }
        public string is_active { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoder_pk { get; set; }
    }
}
