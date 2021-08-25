using System;

namespace cms_server.Entities
{
    public class ConsultReqEntity
    {
        public int? cr_pk { get; set; }
        public string connection_id { get; set; }
        public string consult_req_pk { get; set; }
        public string msg_body { get; set; }
        public DateTime? sent_at { get; set; }
        public string shown { get; set; }
        public DateTime? sender_pk { get; set; }
        public string sender_name { get; set; }
    }
}
