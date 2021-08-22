using Microsoft.AspNetCore.Http;
using System;

namespace cms_server.Entities
{
    public class AdminEntity
    {
        public int? admin_pk { get; set; }
        public int? user_pk { get; set; }
        public string emp_id { get; set; }
        public string pic_dest { get; set; }
        public string first_name { get; set; }
        public string middle_name { get; set; }
        public string last_name { get; set; }
        public string suffix { get; set; }
        public string gender { get; set; }
        public string position { get; set; }
        public string email { get; set; }
        public string mob_no { get; set; }
        public string is_active { get; set; }
        public DateTime? encoded_at { get; set; }
        public string encoder_pk { get; set; }
        //ext
        public IFormFile img_attach { get; set; }
    }
}
