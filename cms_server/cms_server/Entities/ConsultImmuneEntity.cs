using System;

namespace cms_server.Entities
{
    public class ConsultImmuneEntity
    {
        public int? cr_immune_pk { get; set; }
        public string consult_req_pk { get; set; }
        public string vac_pk { get; set; }
        public string vac_desc { get; set; }
        public string vac_type { get; set; }
        public DateTime? date_given { get; set; }
        public DateTime? next_dose { get; set; }
        public string administered_by { get; set; }
        public string is_valid { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoder_pk { get; set; }
    }
}
