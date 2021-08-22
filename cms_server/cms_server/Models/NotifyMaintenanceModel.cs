using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace claim_form_server.Models
{
    public class NotifyMaintenanceModel
    {
        public bool will_maintenance { get; set; }
        public DateTime? maintenance_datetime { get; set; }


    }
}
