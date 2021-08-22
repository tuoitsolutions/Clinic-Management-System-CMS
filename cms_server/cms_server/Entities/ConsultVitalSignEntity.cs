using System;

namespace cms_server.Entities
{
    public class ConsultVitalSignEntity
    {
        public int? cr_vs_pk { get; set; }
        public string consult_req_pk { get; set; }
        public string blood_pressure { get; set; }
        public string heart_rate { get; set; }
        public string resp_rate { get; set; }
        public string temperature { get; set; }
        public string height { get; set; }
        public string weight { get; set; }
        public string bmi { get; set; }
        public string remarks { get; set; }
        public string is_valid { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoder_pk { get; set; }
    }
}
