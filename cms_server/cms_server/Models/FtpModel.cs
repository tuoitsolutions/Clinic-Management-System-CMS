using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ddt_server.Models
{
    public class FtpModel
    {
        public string pk { get; set; }
        public string file_name { get; set; }
        public string file_path { get; set; }
        public DateTime? modified_time { get; set; }
        public string file_base64 { get; set; }
        public byte[] file_byte { get; set; }
    }
}
