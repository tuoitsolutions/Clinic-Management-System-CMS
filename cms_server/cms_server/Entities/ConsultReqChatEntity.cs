using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Entities
{
    public class ConsultReqChatEntity
    {
        public int? cr_chat_pk { get; set; }
        public int? cr_file_pk { get; set; }
        public string connection_id { get; set; }
        public string consult_req_pk { get; set; }
        public string msg_body { get; set; }
        public DateTime? sent_at { get; set; }
        public string shown { get; set; }
        public string sender_pk { get; set; }
        public string sender_name { get; set; }
        public string user_type { get; set; }

        //
        public List<IFormFile> attached_files { get; set; }
    }
}
