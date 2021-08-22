using System.ComponentModel.DataAnnotations;

namespace claim_form_server.Payloads
{
    public class SortPayload
    {
        [Required]
        public string column { get; set; }

        [Required]
        public string direction { get; set; }
    }
}
