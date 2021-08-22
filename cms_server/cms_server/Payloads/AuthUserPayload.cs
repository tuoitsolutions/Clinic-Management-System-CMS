using System.ComponentModel.DataAnnotations;

namespace claim_form_server.Payloads
{
    public class AuthUserPayload
    {
        [Required]
        [StringLength(50)]
        [Display(Name = "Username")]
        public string username { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Password")]
        public string password { get; set; }

        [Required]
        public bool tos { get; set; }

        [Required]
        public bool rememberme { get; set; }


        public string physicaladdress { get; set; }

    }
}
