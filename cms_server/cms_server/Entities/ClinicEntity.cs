namespace cms_server.Entities
{
    public class ClinicEntity
    {
        public string clinic_pk { get; set; }
        public string clinic_logo_dest { get; set; }
        public string clin_name { get; set; }
        public string slogan { get; set; }
        public int? doc_cap { get; set; }
        public int? emp_cap { get; set; }
        public string region_pk { get; set; }
        public string prov_pk { get; set; }
        public string citymun_pk { get; set; }
        public string brgy_pk { get; set; }
        public string street_subd { get; set; }
        public string bhlb { get; set; }
        public string zipcode { get; set; }
        public string email { get; set; }
        public string mob_no { get; set; }
        public string tel_no { get; set; }
        public string sts_pk { get; set; }
        public string encoded_at { get; set; }
        public string encoder_pk { get; set; }
    }
}
