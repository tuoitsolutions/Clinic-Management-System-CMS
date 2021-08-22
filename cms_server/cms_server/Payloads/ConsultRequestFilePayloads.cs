using pos_server.Models;
using System;
using System.Collections.Generic;

namespace pos_server.Payloads
{
    public class ConsultRequestFilePayloads
    {
        public class ConsultRequestFileFilterPayload
        {
            public string consult_req_pk { get; set; }
            public string file_name { get; set; }
            public DateTime? date_to { get; set; }
            public DateTime? date_from { get; set; }
        }
        public class ConsultRequestFileTablePayload
        {
            public ConsultRequestFileFilterPayload filters { get; set; }
            public SortModel sort { get; set; }
            public PageModel page { get; set; }
        }
    }
}
