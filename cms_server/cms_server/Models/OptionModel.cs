using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pos_server.Models
{
    public class OptionModel
    {
        public string id { get; set; }
        public string label { get; set; }
        public object ext_props { get; set; }
    }
}
