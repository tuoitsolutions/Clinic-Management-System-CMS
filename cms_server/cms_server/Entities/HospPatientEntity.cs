using System;

namespace cms_server.Entities
{
    public class HospPatientEntity
    {
        public string hospital_no { get; set; }
        public string user_pk { get; set; }
        public string pic_dest { get; set; }
        public string prefix { get; set; }
        public string first_name { get; set; }
        public string middle_name { get; set; }
        public string last_name { get; set; }
        public string suffix { get; set; }
        public string gender { get; set; }
        public DateTime? birth_date { get; set; }
        public string birth_place { get; set; }
        public string cs_pk { get; set; }
        public string nat_pk { get; set; }
        public string rel_pk { get; set; }
        public string email { get; set; }
        public string mob_no { get; set; }
        public string line1 { get; set; }
        public string line2 { get; set; }
        public int? brgy_pk { get; set; }
        public int? citymun_pk { get; set; }
        public int? prov_pk { get; set; }
        public string region_pk { get; set; }
        public string zip_code { get; set; }
        public int? consult_count { get; set; }
        public DateTime? last_consult_at { get; set; }
        public DateTime? last_updated_at { get; set; }
        public string last_updated_by { get; set; }

        //props as params
        public string consult_req_pk { get; set; }


    }
}
