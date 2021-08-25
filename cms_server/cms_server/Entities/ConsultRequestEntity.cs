using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Entities
{
    public class ConsultRequestEntity
    {
        public string hash_key { get; set; }
        public string consult_req_pk { get; set; }
        public string otp_code { get; set; }
        public string hospital_no { get; set; }
        public string prefix { get; set; }
        public string first_name { get; set; }
        public string middle_name { get; set; }
        public string last_name { get; set; }
        public string suffix { get; set; }
        public string gender { get; set; }
        public string cs_pk { get; set; }
        public string nat_pk { get; set; }
        public string rel_pk { get; set; }
        public DateTime? birth_date { get; set; }
        public string email { get; set; }
        public string mob_no { get; set; }
        public string chief_complaint { get; set; }
        public string symptoms { get; set; }
        public string notes { get; set; }
        public string line1 { get; set; }
        public string line2 { get; set; }
        public string brgy_pk { get; set; }
        public string prov_pk { get; set; }
        public string citymun_pk { get; set; }
        public string region_pk { get; set; }
        public string zip_code { get; set; }
        public string slip_pk { get; set; }
        public string tran_method { get; set; }
        public string discount_type { get; set; }
        public string discount_desc { get; set; }
        public string discount_rate { get; set; }
        public string discount_id_num { get; set; }
        public decimal? discount_amount { get; set; }
        public decimal? consult_cost { get; set; }
        public DateTime? request_at { get; set; }
        public DateTime? accept_at { get; set; }
        public DateTime? soa_sent_at { get; set; }
        public DateTime? pay_at { get; set; }
        public DateTime? consult_at { get; set; }
        public DateTime? ended_at { get; set; }
        public string sts_pk { get; set; }
        public string pay_sts_pk { get; set; }
        public string payment_method { get; set; }
        public string payment_receipt_no { get; set; }
        public DateTime? last_update_at { get; set; }
        public string last_updated_by { get; set; }
        public string payment_source_id { get; set; }
        public int? pay_link_sent_count { get; set; }
        public int? soa_sent_count { get; set; }
        public int? med_pres_sent { get; set; }
        public int? proc_pres_sent { get; set; }
        public string paymongo_src_id { get; set; }
        public DateTime? paymongo_src_id_enc_at { get; set; }
        public DateTime? paymongo_paid_at { get; set; }
        public string assign_dept_pk { get; set; }
        public string assign_res_pk { get; set; }
        public DateTime? assign_dept_consult_date { get; set; }
        public DateTime? assign_dept_at { get; set; }
        public string consult_link_pass { get; set; }
        public string consult_link_hash { get; set; }

        //fk
        public string nat_desc { get; set; }
        public string rel_desc { get; set; }
        public string cs_desc { get; set; }
        public string citymundesc { get; set; }
        public string provincedesc { get; set; }
        public string barangaydesc { get; set; }
        public string regiondesc { get; set; }
        public string psgcaddress { get; set; }
        public string assign_dept_desc { get; set; }
        public string assign_res_desc { get; set; }
        public ConsultRequestFileEntity consult_req_file { get; set; }
        public StatusMasterEntity status { get; set; }
        //ext
        public List<IFormFile> attach_req_files { set; get; }
        public string attach_base64_soa { get; set; }
        public string age { get; set; }
    }
}
