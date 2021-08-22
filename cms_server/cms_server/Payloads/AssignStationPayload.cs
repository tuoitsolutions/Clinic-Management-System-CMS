using pos_server.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace pos_server.Payloads
{
    public class AssignStationPayload
    {

        [Required]
        [StringLength(30)]
        [Display(Name = "Username")]
        public string username { get; set; }

        [Required]
        [StringLength(30)]
        [Display(Name = "Password")]
        public string password { get; set; }

        [Required]
        [Display(Name = "Station")]
        public string station { get; set; }

        [Required]
        [Display(Name = "Mac Address")]
        [MacAddress(fieldName = "Mac Address")]
        public string macaddress { get; set; }
    }
}
