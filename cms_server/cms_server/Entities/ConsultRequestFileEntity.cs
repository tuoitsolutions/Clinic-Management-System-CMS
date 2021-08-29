using Microsoft.AspNetCore.Http;
using System;

namespace cms_server.Entities
{
    public class ConsultRequestFileEntity
    {
        public int cr_file_pk { get; set; }
        public string consult_req_pk { get; set; }
        public string file_dest { get; set; }
        public string file_name { get; set; }
        public string file_type { get; set; }
        public string notes { get; set; }
        public string is_active { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoded_by { get; set; }
        public DateTime? updated_at { get; set; }
        public string updated_by { get; set; }
        //ext
        public IFormFile attach_file { set; get; }

    }
}
