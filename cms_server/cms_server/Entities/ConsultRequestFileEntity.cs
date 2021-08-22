using System;

namespace cms_server.Entities
{
    public class ConsultRequestFileEntity
    {
        public int cr_file_pk { get; set; }
        public string consult_req_pk { get; set; }
        public string file_dest { get; set; }
        public string file_name { get; set; }
        public DateTime? encoded_at { get; set; }
    }
}
