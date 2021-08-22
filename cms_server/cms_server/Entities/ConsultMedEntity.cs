using System;

namespace cms_server.Entities
{
    public class ConsultMedEntity
    {
        public int? cr_med_pk { get; set; }
        public string consult_req_pk { get; set; }
        public string med_no { get; set; }
        public string med_desc { get; set; }
        public string unit { get; set; }
        public string dosage { get; set; }
        public string is_active { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoder_pk { get; set; }
    }
}
