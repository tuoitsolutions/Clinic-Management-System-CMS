using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Entities
{
    public class HospResidentEntity
    {
        public int res_pk { get; set; }
        public int user_pk { get; set; }
        public string doc_id { get; set; }
        public int spclty_pk { get; set; }
        public string pic_dest { get; set; }
        public string prefix { get; set; }
        public string first_name { get; set; }
        public string middle_name { get; set; }
        public string last_name { get; set; }
        public string suffix { get; set; }
        public string gender { get; set; }
        public string bio { get; set; }
        public string email { get; set; }
        public string mob_no { get; set; }
        public string is_active { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoder_pk { get; set; }

        //
        public string specialty { get; set; }
        public IFormFile img_attach { get; set; }
    }
}
