using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace claim_form_server.Payloads
{
    public static class PatientPayloads
    {
        public class GetAdmittedPatientPayload
        {
            public int page { get; set; }
            public int limit { get; set; }
            public SortPayload sort { get; set; }
            public Search search { get; set; }

            public class Search
            {
                public string search { get; set; }
                public DateTime admitfrom { get; set; }
                public DateTime admitto { get; set; }
            }

        }
    }
}
