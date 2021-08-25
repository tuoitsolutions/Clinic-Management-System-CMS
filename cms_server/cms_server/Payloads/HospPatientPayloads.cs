using pos_server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Payloads
{
    public class HospPatientPayloads
    {
        public class HospPatientFilterPayload
        {
            public string hospital_no { get; set; }
            public string first_name { get; set; }
            public string last_name { get; set; }
            public DateTime? date_to { get; set; }
            public DateTime? date_from { get; set; }
        }
        public class HospPatientTablePayload
        {
            public HospPatientFilterPayload filters { get; set; }
            public SortModel sort { get; set; }
            public PageModel page { get; set; }
        }

    }
}
