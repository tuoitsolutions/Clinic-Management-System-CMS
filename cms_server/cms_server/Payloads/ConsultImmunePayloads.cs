using pos_server.Models;
using System;
using System.Collections.Generic;

namespace cms_server.Payloads
{
    public class ConsultImmunePayloads
    {
        public class ConsultImmuneFilterPayload
        {
            public string hospital_no { get; set; }
            public string consult_req_pk { get; set; }
            public string vac_desc { get; set; }
            public string vac_type { get; set; }
            public List<string> is_valid { get; set; }
            public DateTime? date_given_to { get; set; }
            public DateTime? date_given_from { get; set; }
            public DateTime? date_to { get; set; }
            public DateTime? date_from { get; set; }
        }
        public class ConsultImmuneTablePayload
        {
            public ConsultImmuneFilterPayload filters { get; set; }
            public SortModel sort { get; set; }
            public PageModel page { get; set; }
        }

    }
}
