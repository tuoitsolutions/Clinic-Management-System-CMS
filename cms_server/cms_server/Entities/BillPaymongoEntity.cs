using System;
using System.Collections.Generic;

namespace cms_server.Entities
{
    public class BillPaymongoEntity
    {
        public string bill_paymongo_pk { get; set; }
        public string id { get; set; }
        public string event_type { get; set; }
        public string source_type { get; set; }
        public int? amount { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string line1 { get; set; }
        public string line2 { get; set; }
        public string postal_code { get; set; }
        public string state { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string currency { get; set; }
        public bool? livemode { get; set; }
        public string checkout_url { get; set; }
        public string failed_url { get; set; }
        public string success_url { get; set; }
        public string status { get; set; }
        public string type { get; set; }
        public int? created_at { get; set; }
        public int? updated_at { get; set; }
        public int? paid_at { get; set; }
        public int? available_at { get; set; }
        public string consult_req_pk { get; set; }
        public int? fee { get; set; }
        public string pay_descrip { get; set; }
        public int? pay_net_amount { get; set; }
        public string pay_payout { get; set; }
        public string pay_src_id { get; set; }
        public string pay_src_type { get; set; }
        public string pay_statement_descrip { get; set; }

        //card
        public string payment_intent_id { get; set; }
        public string origin { get; set; }
        public string tax_amount { get; set; }
        public List<dynamic> refunds { get; set; }
        public List<dynamic> taxes { get; set; }
        public string access_url { get; set; }
        public string client_key { get; set; }


        public string card_src_id { get; set; }

        public string card_src_type { get; set; }
        public string card_src_brand { get; set; }
        public string card_src_country { get; set; }
        public string card_src_last4 { get; set; }


        public DateTime? logged_at { get; set; }



    }
}
