using pos_server.Models;
using System;
using System.Collections.Generic;

namespace pos_server.Payloads
{
    public class ConsultRequestPayloads
    {
        public class ConsultRequestFilterPayload
        {
            public string consult_req_pk { get; set; }
            public string email { get; set; }
            public string last_name { get; set; }
            public string first_name { get; set; }
            public string chief_complaint { get; set; }
            public string symptoms { get; set; }
            public List<string> sts_pk { get; set; }
            public DateTime? request_to { get; set; }
            public DateTime? request_from { get; set; }

            //ext
            public List<string> res_depts { get; set; }
        }
        public class ConsultRequestTablePayload
        {
            public ConsultRequestFilterPayload filters { get; set; }
            public SortModel sort { get; set; }
            public PageModel page { get; set; }
        }

        public class SendMessagePayload
        {
            public string consult_req_pk { get; set; }
            public string body { get; set; }
            public List<string> send_to { get; set; }
        }
    }
}
