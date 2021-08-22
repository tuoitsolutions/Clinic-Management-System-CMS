using pos_server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Payloads
{
    public class ConsultProcPayloads
    {
        public class ConsultProcFilterPayload
        {
            public string hospital_no { get; set; }
            public string consult_req_pk { get; set; }
            public string proc_desc { get; set; }
            public List<string> is_active { get; set; }
            public DateTime? date_to { get; set; }
            public DateTime? date_from { get; set; }
        }
        public class ConsultProcTablePayload
        {
            public ConsultProcFilterPayload filters { get; set; }
            public SortModel sort { get; set; }
            public PageModel page { get; set; }
        }

    }
}
