using pos_server.Models;
using System;
using System.Collections.Generic;

namespace pos_server.Payloads
{
    public class DeptResidentPayloads
    {
        public class DeptResidentFilterPayload
        {
            public string dept_pk { get; set; }
            public string first_name { get; set; }
            public string last_name { get; set; }
            public List<string> is_active { get; set; }
            public DateTime? date_to { get; set; }
            public DateTime? date_from { get; set; }
        }
        public class DeptResidentTablePayload
        {
            public DeptResidentFilterPayload filters { get; set; }
            public SortModel sort { get; set; }
            public PageModel page { get; set; }
        }
    }
}
