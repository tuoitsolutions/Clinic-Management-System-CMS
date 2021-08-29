using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Models
{
    public class DashboardModel
    {
        public class PieDashboardModel
        {
            public int total { get; set; }
            public string label { get; set; }
            public string bg_color { get; set; }
        }

        public class LineDashboardModel
        {
            public string x { get; set; }
            public string y { get; set; }
        }
    }
}
