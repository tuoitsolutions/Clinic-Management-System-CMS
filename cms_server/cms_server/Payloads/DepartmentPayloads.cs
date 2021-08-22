using pos_server.Models;
using System;
using System.Collections.Generic;

namespace pos_server.Payloads
{
    public class DepartmentPayloads
    {
        public class DepartmentFilterPayload
        {
            public string dept_code { get; set; }
            public string dept_name { get; set; }
            public List<string> is_active { get; set; }
            public DateTime? date_to { get; set; }
            public DateTime? date_from { get; set; }
        }
        public class DepartmentTablePayload
        {
            public DepartmentFilterPayload filters { get; set; }
            public SortModel sort { get; set; }
            public PageModel page { get; set; }
        }

    }
}
