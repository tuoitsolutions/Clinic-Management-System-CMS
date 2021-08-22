using pos_server.Models;
using System;
using System.Collections.Generic;

namespace pos_server.Payloads
{
    public class HospResidentPayloads
    {
        public class HospResidentFilterPayload
        {
            public string doc_id { get; set; }
            public string first_name { get; set; }
            public string last_name { get; set; }
            public string specialty { get; set; }
            public List<string> is_active { get; set; }
            public DateTime? date_to { get; set; }
            public DateTime? date_from { get; set; }
        }
        public class HospResidentTablePayload
        {
            public HospResidentFilterPayload filters { get; set; }
            public SortModel sort { get; set; }
            public PageModel page { get; set; }
        }
    }
}
