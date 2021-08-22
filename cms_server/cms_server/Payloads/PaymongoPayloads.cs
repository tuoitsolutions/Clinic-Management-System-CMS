using pos_server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static cms_server.Models.PaymongoModel;

namespace cms_server.Payloads
{
    public class PaymongoPayloads
    {
        public class PaymongoEwalletPayload
        {
            public string consult_req_pk { get; set; }
            public string type { get; set; }
            public string currency { get; set; }
            public int amount { get; set; }
            public List<string> payment_method_allowed { get; set; }
            public PaymongoPayMethodOptions payment_method_options { get; set; }
            public string description { get; set; }
            public string statement_descriptor { get; set; }
            public object metadata { get; set; }
            public PaymongoBillingModel billing { get; set; }
            public PaymongoRedirectModel redirect { get; set; }
        }

        public class PaymongoCardPayload
        {
            public PaymongoCardDataPayload data { get; set; }
        }

        public class PaymongoCardDataPayload
        {
            public PaymongoEwalletPayload attributes { get; set; }
        }

        public class PaymongoPayMethodOptions
        {
            public PaymongoPayMethodOptionsCard card { get; set; }
        }
        public class PaymongoPayMethodOptionsCard
        {
            public string request_three_d_secure { get; set; }
        }

        public class PaymongoFilterPayload
        {
            public string consult_req_pk { get; set; }
            public string id { get; set; }
            public string event_type { get; set; }
            public string pay_src_id { get; set; }
            public string pay_src_type { get; set; }
            public string pay_descrip { get; set; }
            public DateTime? date_to { get; set; }
            public DateTime? date_from { get; set; }
        }
        public class PaymongoTablePayload
        {
            public PaymongoFilterPayload filters { get; set; }
            public SortModel sort { get; set; }
            public PageModel page { get; set; }
        }


    }
}
