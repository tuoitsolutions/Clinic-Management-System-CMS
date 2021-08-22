using System;

namespace cms_server.Entities
{
    public class ConsultMedProbEntity
    {
        public int? cr_med_prob_pk { get; set; }
        public string consult_req_pk { get; set; }
        public string med_prob_pk { get; set; }
        public string med_prob_desc { get; set; }
        public string med_prob_host { get; set; }
        public string is_active { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoder_pk { get; set; }
    }
}
