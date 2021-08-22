using pos_server.Models;
using System;
using System.Collections.Generic;

namespace pos_server.Payloads
{
    public class MenuPayloads
    {
        public class MenuFilterPayload
        {
            public string menudesc { get; set; }
            public string categdesc { get; set; }
            public string unit_code { get; set; }
            public List<string> priono { get; set; }
            public List<string> isactive { get; set; }
            public int? price_to { get; set; }
            public int? price_from { get; set; }
            public DateTime? date_to { get; set; }
            public DateTime? date_from { get; set; }
        }
        public class MenuPagePayload
        {
            public MenuFilterPayload filters { get; set; }
            public SortModel sort { get; set; }
            public PageModel page { get; set; }
        }

        public class MenuTransacFilterPayload
        {
            public string menudesc { get; set; }
            public string categno { get; set; }
        }
        public class MenuTransacPagePayload
        {
            public MenuTransacFilterPayload filters { get; set; }
            public PageModel page { get; set; }
        }
    }
}
