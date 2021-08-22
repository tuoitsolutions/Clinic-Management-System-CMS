using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace claim_form_server.Payloads
{
    public static class NotifyMaintenancePayloads
    {

        public class NotifyMaintenancePayload
        {
            [Required]
            public string message { get; set; }
            [Required]
            public DateTime maintenanceTime { get; set; }
            [Required]
            public string username { get; set; }
            [Required]
            public string password { get; set; }
        }
    }
}
