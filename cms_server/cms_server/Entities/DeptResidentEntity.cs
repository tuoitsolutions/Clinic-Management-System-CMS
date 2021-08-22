using System;

namespace cms_server.Entities
{
    public class DeptResidentEntity
    {
        public int dept_res_pk { get; set; }
        public int dept_pk { get; set; }
        public int res_pk { get; set; }
        public string notes { get; set; }
        public string is_active { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoder_pk { get; set; }

        //ext
        public DepartmentEntity department { get; set; }
        public HospResidentEntity hosp_res { get; set; }
    }
}
