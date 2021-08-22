using pos_server.Models;
using System;
using System.Collections.Generic;

namespace pos_server.Payloads
{
    public class CategoryPayloads
    {
        public class CategoryFilterPayload
        {
            public string categdesc { get; set; }
            public List<string> isactive { get; set; }
            public DateTime? date_to { get; set; }
            public DateTime? date_from { get; set; }
        }
        public class CategoryPagePayload
        {
            public CategoryFilterPayload filters { get; set; }
            public SortModel sort { get; set; }
            public PageModel page { get; set; }
        }
    }
}
