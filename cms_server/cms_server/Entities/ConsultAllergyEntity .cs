using System;

namespace cms_server.Entities
{
    public class ConsultAllergyEntity
    {
        public int? cr_allergy_pk { get; set; }
        public string consult_req_pk { get; set; }
        public string substance { get; set; }
        public string reaction { get; set; }
        public DateTime? first_occur { get; set; }
        public string notes { get; set; }
        public string is_active { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoder_pk { get; set; }
    }
}
