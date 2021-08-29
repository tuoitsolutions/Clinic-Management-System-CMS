using claim_form_server.Repositories;
using cms_server.Entities;
using cms_server.Hooks;
using cms_server.Pdf;
using Dapper;
using ddt_server.Config;
using ddt_server.Hooks;
using ddt_server.Models;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Hooks;
using DeliveryRoomWatcher.Models.Common;
using DeliveryRoomWatcher.Repositories;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using static pos_server.Payloads.ConsultRequestPayloads;

namespace cms_server.Repositories
{
    public class ConsultRequestRepo
    {
        UserRepo user_repo = new UserRepo();
        DefValRepo def_val_repo = new DefValRepo();
        public ResponseModel InsertConsultRequest(ConsultRequestEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                string otp_result = con.QuerySingleOrDefault<string>($@"
                                    SELECT IF(COUNT(otp_code) > 0, IF(TIMESTAMPDIFF(SECOND,encoded_at,NOW())> 300 ,'e','v'), 'x') result FROM otp WHERE otp_code = @otp_code and mob_no = @mob_no;
                                    ",
                          payload, transaction: tran);
                if (otp_result.Equals("e"))
                {
                    tran.Rollback();
                    return new ResponseModel
                    {
                        success = false,
                        message = "The otp code that you have entered has already expired!"
                    };
                }
                else if (otp_result.Equals("x"))
                {
                    tran.Rollback();
                    return new ResponseModel
                    {
                        success = false,
                        message = "The otp code that you have entered is not correct! Please try again."
                    };
                }

                payload.consult_req_pk = con.QuerySingle<string>($@"SELECT next_consult_consult_req_pk(NULL)", null, transaction: tran);

                int add_consult_request = con.Execute(@"
                            INSERT INTO `consult_request` SET
                            consult_req_pk=@consult_req_pk,
                            prefix=@prefix,
                            first_name=@first_name,
                            middle_name=@middle_name,
                            last_name=@last_name,
                            suffix=@suffix,
                            gender=@gender,
                            cs_pk=@cs_pk,
                            nat_pk=@nat_pk,
                            rel_pk=@rel_pk,
                            birth_date=DATE(@birth_date),
                            email=@email,
                            mob_no=@mob_no,
                            chief_complaint=@chief_complaint,
                            symptoms=@symptoms,
                            is_charity=@is_charity,
                            is_agree_priv_pol=@is_agree_priv_pol,
                            assign_dept_pk=@assign_dept_pk,
                            notes=@notes,
                            brgy_pk=@brgy_pk,
                            prov_pk=@prov_pk,
                            citymun_pk=@citymun_pk,
                            region_pk=@region_pk,
                            zip_code=@zip_code,
                            line1=@line1,
                            request_at = NOW(),
                            sts_pk = 'fa';
                            ",
                    payload, transaction: tran);

                if (add_consult_request > 0)
                {
                    if (payload?.attach_req_files != null)
                    {

                        foreach (var f in payload.attach_req_files)
                        {

                            FileResponseModel file_upload_response = new FileResponseModel
                            {
                                success = true
                            };

                            var proc_file_payload = new ConsultRequestFileEntity()
                            {
                                consult_req_pk = payload.consult_req_pk
                            };

                            file_upload_response = UseFtp.UploadFtp(f, DefaultConfig.ftp_ip + "/" + DefaultConfig.app_name + "/Uploads/ConsultationFiles/", DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
                            if (!file_upload_response.success)
                            {
                                return new ResponseModel
                                {
                                    success = false,
                                    message = file_upload_response.message
                                };
                            }
                            else
                            {
                                proc_file_payload.file_dest = file_upload_response.data.path;
                                proc_file_payload.file_name = file_upload_response.data.name;
                            }


                            int add_file = con.Execute(@"
                                INSERT INTO `consult_request_file` 
                                SET 
                                consult_req_pk=@consult_req_pk, 
                                file_dest=@file_dest,
                                file_name=@file_name,
                                encoded_at=NOW();",
                                proc_file_payload, transaction: tran);

                            if (add_file <= 0)
                            {
                                tran.Rollback();
                                return new ResponseModel
                                {
                                    success = false,
                                    message = $"The {f.FileName} could not be saved! Please try again!"
                                };
                            }
                        }

                    }
                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        message = "Your consultation request has been created. We will keep in touch for further details."
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "No affected rows when trying to save the consultation request. "
                    };
                }
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

        public ResponseModel SendPaymentLink(string consult_req_pk, string user_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                                  $@"SELECT * FROM (
                                                   SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgcaddress
                                                   FROM `consult_request` cr
                                                   LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                   LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                   LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                   LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                                   WHERE consult_req_pk=@consult_req_pk limit 1 ;",
                                                  new { consult_req_pk }, transaction: tran);

                int update_sts_affected_rows = con.Execute($@"
                                        update consult_request set  pay_link_sent_count = (pay_link_sent_count + 1) where consult_req_pk=@consult_req_pk;
                            ", new { selected_row.consult_req_pk }, transaction: tran);

                if (update_sts_affected_rows > 0)
                {
                    int insert_logs_affected_rows = con.Execute($@"
                                         insert into logs set
                                         ref_pk=@ref_pk,
                                         ref_table=@ref_table,
                                         activity=@activity,
                                         encoded_at = now(),
                                         encoded_by=@encoded_by;
                            ",
                    new LogModel
                    {
                        activity = $"sent the payment link of {selected_row.last_name}, {selected_row.first_name}",
                        encoded_by = user_pk,
                        ref_pk = selected_row.consult_req_pk,
                        ref_table = "consult_request"
                    }, transaction: tran);

                    if (insert_logs_affected_rows > 0)
                    {

                        //string otp_code = UseOtp.create();
                        string otp_code = "111111";

                        string full_body = $@"This is {def_val_repo.GetHospitalName().data}. Dear {selected_row.last_name}, {selected_row.ended_at}, your Consultation Request Payment Link OTP is: {otp_code}. This is only valid within 24 hours.";

                        int message_affected_rows = con.Execute($@"INSERT INTO messageout SET
                                                                messageto='${selected_row.mob_no}',
                                                                messagetext=@full_body;"
                                                       , new { full_body }, transaction: tran);

                        if (message_affected_rows > 0)
                        {
                            con.Execute($@"DELETE from otp where mob_no=@mob_no;",
                              new
                              {
                                  mob_no = selected_row.mob_no
                              }, transaction: tran);

                            OtpEntity otp_payload = new OtpEntity
                            {
                                otp_code = otp_code,
                                mob_no = selected_row.mob_no,
                                consult_req_pk = selected_row.consult_req_pk,
                                user_pk = selected_row.email
                            };

                            int insert_otp_affected_rows = con.Execute(
                                        "INSERT INTO OTP set user_pk=@user_pk, mob_no=@mob_no, consult_req_pk=@consult_req_pk, otp_code=@otp_code;",
                                       otp_payload, transaction: tran);

                            if (insert_otp_affected_rows > 0)
                            {


                                string brand_name = def_val_repo.GetHospitalName().data.ToString();

                                string email_message = $@"This is {brand_name}. Dear {selected_row.email},  kindly pay your Consultation Request at " + DefaultConfig._clientBaseUrl + "consultation-payment/" + selected_row.hash_key +
                                                                                                        " . Please do not share this link to prevent outside sources from accessing your data.";
                                ResponseModel email_response = UseEmail.SendEmail(brand_name, selected_row.email, email_message, "Online Consultation Payment Page");


                                if (email_response.success)
                                {
                                    tran.Commit();
                                    return new ResponseModel
                                    {
                                        message = $"The consultation request of '{selected_row.last_name}, {selected_row.first_name}' has been sent successfully!",
                                        success = true
                                    };
                                }
                                else
                                {
                                    return email_response;
                                }
                            }
                        }
                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "No affected rows when trying to send the payment link."
                    };
                }


                return new ResponseModel
                {
                    success = false,
                    message = "Some error occured during the process."
                };

            }
            catch (Exception err)
            {

                return new ResponseModel
                {
                    success = false,
                    message = err.Message
                };
            }
        }

        public ResponseModel DeclineConsultRequest(SendMessagePayload payload, string user_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                                  $@"SELECT * FROM (
                                                   SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgcaddress
                                                   FROM `consult_request` cr
                                                   LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                   LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                   LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                   LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                                   WHERE consult_req_pk=@consult_req_pk limit 1 ;",
                                                  new { payload.consult_req_pk }, transaction: tran);

                int update_sts_affected_rows = con.Execute($@"
                                        update consult_request set  sts_pk ='x' where consult_req_pk=@consult_req_pk;
                            ", new { selected_row.consult_req_pk }, transaction: tran);

                if (update_sts_affected_rows > 0)
                {
                    int insert_logs_affected_rows = con.Execute($@"
                                         insert into logs set
                                         ref_pk=@ref_pk,
                                         ref_table=@ref_table,
                                         activity=@activity,
                                         encoded_at = now(),
                                         encoded_by=@encoded_by;
                            ",
                    new LogModel
                    {
                        activity = $"the consultation request of {selected_row.last_name}, {selected_row.first_name} has been declined!",
                        encoded_by = user_pk,
                        ref_pk = selected_row.consult_req_pk,
                        ref_table = "consult_request"
                    }, transaction: tran);

                    if (insert_logs_affected_rows > 0)
                    {

                        //string otp_code = UseOtp.create();
                        string otp_code = "111111";

                        bool send_to_sms = payload.send_to.FirstOrDefault(x => x == "sms") == null ? false : true;
                        bool send_to_email = payload.send_to.FirstOrDefault(x => x == "email") == null ? false : true;


                        string full_body = $"This is {def_val_repo.GetHospitalName().data}. Dear {selected_row.last_name}, {selected_row.first_name}, your consultation request has been declined. {payload.body} ";

                        if (send_to_sms)
                        {
                            int message_sent = con.Execute($@"INSERT INTO messageout SET
                                                              messageto='${selected_row.mob_no}',
                                                              messagetext=@messagetext;",
                                                              new { messageto = selected_row.mob_no, messagetext = full_body }, transaction: tran);

                            if (message_sent < 1)
                            {
                                return new ResponseModel
                                {
                                    success = false,
                                    message = "An error has occured when trying to send the message. Please try again!"
                                };
                            }
                        }

                        if (send_to_email)
                        {
                            string brand_name = def_val_repo.GetHospitalName().data.ToString();
                            ResponseModel email_response = UseEmail.SendEmail(brand_name, selected_row.email, full_body, "Consultation Request Message");

                            if (!email_response.success)
                            {
                                return email_response;

                            }

                        }

                        tran.Commit();
                        return new ResponseModel
                        {
                            message = $"The consultation request of '{selected_row.last_name}, {selected_row.first_name}' has been declined!",
                            success = true
                        };

                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "No affected rows in the process."
                    };
                }


                return new ResponseModel
                {
                    success = false,
                    message = "Some error occured during the process."
                };

            }
            catch (Exception err)
            {

                return new ResponseModel
                {
                    success = false,
                    message = err.Message
                };
            }
        }

        public ResponseModel GetTableConsultRequest(ConsultRequestTablePayload payload, string user_pk, string user_type)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                string tbl_sql_query = "";

                if (user_type.Equals("admin"))
                {
                    tbl_sql_query = $@"
                                       SELECT * FROM (
                                       SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgaddress FROM `consult_request` cr
                                       LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                       LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                       LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                       LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                       WHERE
                                       COALESCE(last_name,'') LIKE CONCAT('%',@last_name,'%')
                                       AND COALESCE(last_name,'') LIKE CONCAT('%',@last_name,'%')
                                       AND COALESCE(first_name,'') LIKE CONCAT('%',@first_name,'%')
                                       AND COALESCE(email,'') LIKE CONCAT('%',@email,'%')
                                       AND COALESCE(chief_complaint,'') LIKE CONCAT('%',@chief_complaint,'%')
                                       AND COALESCE(symptoms,'') LIKE CONCAT('%',@symptoms,'%')
                                       {UseFilter.GenerateSearchEqualOrDefault("AND", "consult_req_pk", "@consult_req_pk")}
                                       AND sts_pk IN @sts_pk
                                       {UseFilter.GenWhereDateClause("request_at", ">=", payload.filters.request_from)} 
                                       {UseFilter.GenWhereDateClause("request_at", "<=", payload.filters.request_to)} 
                                       {UseFilter.GenTablePagination(payload.sort, payload.page)}
                                    ";
                }
                else if (user_type.Equals("hosp_resident"))
                {
                    payload.filters.res_depts = user_repo.HospResidentDepts(user_pk);

                    tbl_sql_query = $@"
                                       SELECT * FROM (
                                       SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgaddress
                                       ,calc_age(birth_date) AS age FROM `consult_request` cr
                                       LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                       LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                       LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                       LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                       WHERE
                                       COALESCE(last_name,'') LIKE CONCAT('%',@last_name,'%')
                                       AND COALESCE(last_name,'') LIKE CONCAT('%',@last_name,'%')
                                       AND COALESCE(first_name,'') LIKE CONCAT('%',@first_name,'%')
                                       AND COALESCE(email,'') LIKE CONCAT('%',@email,'%')
                                       AND COALESCE(chief_complaint,'') LIKE CONCAT('%',@chief_complaint,'%')
                                       AND COALESCE(symptoms,'') LIKE CONCAT('%',@symptoms,'%')
                                       {UseFilter.GenerateSearchEqualOrDefault("AND", "consult_req_pk", "@consult_req_pk")}
                                       AND sts_pk IN @sts_pk
                                       AND assign_dept_pk IN @res_depts
                                       AND sts_pk NOT IN ('x','fa')
                                       {UseFilter.GenWhereDateClause("request_at", ">=", payload.filters.request_from)} 
                                       {UseFilter.GenWhereDateClause("request_at", "<=", payload.filters.request_to)} 
                                       {UseFilter.GenTablePagination(payload.sort, payload.page)}
                                    ";
                }

                List<ConsultRequestEntity> table_data = con.Query<ConsultRequestEntity>(tbl_sql_query, payload.filters, transaction: tran).ToList();

                bool has_more = table_data.Count > payload.page.limit;

                if (has_more)
                {
                    table_data.RemoveAt(table_data.Count - 1);
                }

                int count = has_more ? -1 : payload.page.begin * payload.page.limit + table_data.Count;

                foreach (var row in table_data)
                {
                    row.status = con.QuerySingle<StatusMasterEntity>(
                        "select * from status_master where sts_pk=@sts_pk"
                        , new { row.sts_pk }
                        , transaction: tran);
                }

                return new ResponseModel
                {
                    success = true,
                    data =
                    new
                    {
                        table = table_data,
                        begin = payload.page.begin,
                        count = count,
                        limit = payload.page.limit
                    }
                };

            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }


        public ResponseModel GetTablePatConsultHistory(ConsultRequestTablePayload payload, string user_pk, string user_type)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                string tbl_sql_query = "";

                if (user_type.Equals("admin"))
                {
                    tbl_sql_query = $@"
                                       SELECT * FROM (
                                       SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgaddress FROM `consult_request` cr
                                       LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                       LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                       LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                       LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`
                                       WHERE hospital_no = @hospital_no 
                                       ) AS tmp
                                       WHERE
                                       COALESCE(last_name,'') LIKE CONCAT('%',@last_name,'%')
                                       AND COALESCE(last_name,'') LIKE CONCAT('%',@last_name,'%')
                                       AND COALESCE(first_name,'') LIKE CONCAT('%',@first_name,'%')
                                       AND COALESCE(email,'') LIKE CONCAT('%',@email,'%')
                                       AND COALESCE(chief_complaint,'') LIKE CONCAT('%',@chief_complaint,'%')
                                       AND COALESCE(symptoms,'') LIKE CONCAT('%',@symptoms,'%')
                                       AND sts_pk = 'e'
                                       {UseFilter.GenWhereDateClause("request_at", ">=", payload.filters.request_from)} 
                                       {UseFilter.GenWhereDateClause("request_at", "<=", payload.filters.request_to)} 
                                       {UseFilter.GenTablePagination(payload.sort, payload.page)}
                                    ";
                }
                else if (user_type.Equals("hosp_resident"))
                {
                    payload.filters.res_depts = user_repo.HospResidentDepts(user_pk);

                    tbl_sql_query = $@"
                                       SELECT * FROM (
                                       SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgaddress
                                       ,calc_age(birth_date) AS age FROM `consult_request` cr
                                       LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                       LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                       LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                       LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`
                                       WHERE hospital_no = @hospital_no) AS tmp
                                       WHERE
                                       COALESCE(last_name,'') LIKE CONCAT('%',@last_name,'%')
                                       AND COALESCE(last_name,'') LIKE CONCAT('%',@last_name,'%')
                                       AND COALESCE(first_name,'') LIKE CONCAT('%',@first_name,'%')
                                       AND COALESCE(email,'') LIKE CONCAT('%',@email,'%')
                                       AND COALESCE(chief_complaint,'') LIKE CONCAT('%',@chief_complaint,'%')
                                       AND COALESCE(symptoms,'') LIKE CONCAT('%',@symptoms,'%')
                                       AND sts_pk = 'e'
                                       AND assign_dept_pk IN @res_depts
                                       {UseFilter.GenWhereDateClause("request_at", ">=", payload.filters.request_from)} 
                                       {UseFilter.GenWhereDateClause("request_at", "<=", payload.filters.request_to)} 
                                       {UseFilter.GenTablePagination(payload.sort, payload.page)}
                                    ";
                }

                List<ConsultRequestEntity> table_data = con.Query<ConsultRequestEntity>(tbl_sql_query, payload.filters, transaction: tran).ToList();

                bool has_more = table_data.Count > payload.page.limit;

                if (has_more)
                {
                    table_data.RemoveAt(table_data.Count - 1);
                }

                int count = has_more ? -1 : payload.page.begin * payload.page.limit + table_data.Count;

                foreach (var row in table_data)
                {
                    row.status = con.QuerySingleOrDefault<StatusMasterEntity>(
                        "select * from status_master where sts_pk=@sts_pk"
                        , new { row.sts_pk }
                        , transaction: tran);
                }

                return new ResponseModel
                {
                    success = true,
                    data =
                    new
                    {
                        table = table_data,
                        begin = payload.page.begin,
                        count = count,
                        limit = payload.page.limit
                    }
                };

            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }


        public ResponseModel GetConsultReqByPk(string hash_key, string user_pk, string user_type)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                string sql_query = "";

                List<ConsultRequestEntity> table_data = new List<ConsultRequestEntity>();

                if (user_type.Equals("admin"))
                {
                    sql_query = $@"SELECT * FROM (
                      SELECT cr.*,MD5(cr.consult_req_pk) hash_key
                      ,r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc
                      ,psg.`citymundesc`,psg.`provincedesc`,psg.`barangaydesc`,psg.`regiondesc`,psg.`completeaddress` psgcaddress
                      ,CONCAT(d.dept_code,'-',d.dept_name) AS `assign_dept_desc`
                      ,CONCAT( hr.`last_name`,', ',hr.`first_name`,IF(hr.`suffix` IS NULL, '',CONCAT(' ',hr.`suffix`))) AS `assign_res_desc`
                      FROM `consult_request` cr
                      LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                      LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                      LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                      LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`
                      LEFT JOIN `department` d ON d.`dept_pk` = cr.`assign_dept_pk`
                      LEFT JOIN `hosp_resident` hr ON hr.`res_pk` = cr.`assign_res_pk`
                      ) AS tmp
                      WHERE hash_key=@hash_key LIMIT 1 ;";

                    table_data = con.Query<ConsultRequestEntity>(sql_query
                                , new { hash_key }, transaction: tran).ToList();
                }
                else if (user_type.Equals("hosp_resident"))
                {
                    List<string> user_resident_dept = user_repo.HospResidentDepts(user_pk);

                    sql_query = $@"SELECT * FROM (
                      SELECT cr.*,MD5(cr.consult_req_pk) hash_key
                      ,r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc
                      ,psg.`citymundesc`,psg.`provincedesc`,psg.`barangaydesc`,psg.`regiondesc`,psg.`completeaddress` psgcaddress
                      ,CONCAT(d.dept_code,'-',d.dept_name) AS `assign_dept_desc`
                      ,CONCAT( hr.`last_name`,', ',hr.`first_name`,IF(hr.`suffix` IS NULL, '',CONCAT(' ',hr.`suffix`))) AS `assign_res_desc`
                      FROM `consult_request` cr
                      LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                      LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                      LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                      LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`
                      LEFT JOIN `department` d ON d.`dept_pk` = cr.`assign_dept_pk`
                      LEFT JOIN `hosp_resident` hr ON hr.`res_pk` = cr.`assign_res_pk`
                      ) AS tmp
                      WHERE hash_key=@hash_key AND assign_dept_pk IN @user_resident_dept LIMIT 1;";

                    table_data = con.Query<ConsultRequestEntity>(sql_query
                               , new { hash_key, user_resident_dept }, transaction: tran).ToList();

                    if (table_data?.Count <= 0)
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = $@"The consultation that you are trying to manage cannot be found: it could be that you are not allowed to manage this request or it does not exist.",
                        };
                    }
                }
                else
                {
                    sql_query = $@"SELECT * FROM (
                      SELECT cr.*,MD5(cr.consult_req_pk) hash_key
                      ,r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc
                      ,psg.`citymundesc`,psg.`provincedesc`,psg.`barangaydesc`,psg.`regiondesc`,psg.`completeaddress` psgcaddress
                      ,CONCAT(d.dept_code,'-',d.dept_name) AS `assign_dept_desc`
                      ,CONCAT( hr.`last_name`,', ',hr.`first_name`,IF(hr.`suffix` IS NULL, '',CONCAT(' ',hr.`suffix`))) AS `assign_res_desc`
                      FROM `consult_request` cr
                      LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                      LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                      LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                      LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`
                      LEFT JOIN `department` d ON d.`dept_pk` = cr.`assign_dept_pk`
                      LEFT JOIN `hosp_resident` hr ON hr.`res_pk` = cr.`assign_res_pk`
                      ) AS tmp
                      WHERE hash_key=@hash_key LIMIT 1 ;";

                    table_data = con.Query<ConsultRequestEntity>(sql_query
                                , new { hash_key }, transaction: tran).ToList();
                }

                if (table_data.Count > 0)
                {
                    ConsultRequestEntity selected_row = table_data[0];

                    selected_row.status = con.QuerySingleOrDefault<StatusMasterEntity>(
                        "select * from status_master where sts_pk=@sts_pk"
                        , new { selected_row.sts_pk }
                        , transaction: tran);

                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        data = selected_row
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "The record that you are trying to retrieve does not exist!"
                    };
                }
            }
            catch (Exception err)
            {

                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

        public ResponseModel IsPayLinkExpired(string hash_key)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<string> table_pay_link_sts = con.Query<string>(
                    $@"SELECT IF( TIMESTAMPDIFF(SECOND,pay_link_sent_at,NOW()) > 86400 ,'expired','valid') AS pay_link_sts FROM `consult_request` 
	                    WHERE `pay_link_sent_count` > 0
	                    AND (`pay_at` IS NULL  OR `sts_pk` = 'fa' OR `paymongo_paid_at` IS NULL)
	                    AND MD5(consult_req_pk) = @hash_key;",
                    new { hash_key }, transaction: tran).ToList();

                if (table_pay_link_sts.Count > 0)
                {
                    string pay_link_sts = table_pay_link_sts[0];

                    if (pay_link_sts.Equals("valid"))
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            //message = "The payment link that you are trying to access has already been expired! "
                        };
                    }

                    if (pay_link_sts.Equals("expired"))
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "The payment link that you are trying to access has already been expired! "
                        };
                    }
                }

                return new ResponseModel
                {
                    success = false,
                    message = "The payment link that you are trying to access does not exist! "
                };
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

        public ResponseModel IsPayOtpVerified(string hash_key)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<string> table_is_verified = con.Query<string>(
                    $@"SELECT is_verified FROM `otp` WHERE MD5(consult_req_pk) = @hash_key; "
                    , new { hash_key }, transaction: tran).ToList();

                if (table_is_verified.Count > 0)
                {
                    string is_verified = table_is_verified[0];

                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        data = is_verified
                    };
                }

                return new ResponseModel
                {
                    success = false,
                    message = "The payment link that you are trying to access does not exist! "
                };
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

        public ResponseModel VerifyPayOtp(OtpEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                string otp_sts = con.QuerySingle<string>(
                    $@"SELECT IF(COUNT(otp_code) > 0, IF(TIMESTAMPDIFF(SECOND,encoded_at,NOW())> expire_sec ,'e','v'), 'x') result FROM otp WHERE
	                   MD5(consult_req_pk)=@consult_req_pk
	                   AND otp_code =@otp_code",
                   payload, transaction: tran);

                if (otp_sts.Equals("x"))
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "The OTP that you entered is not correct. Kindly provide the valid one."
                    };
                }

                if (otp_sts.Equals("e"))
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "The OTP in this payment link has already been expired. Kindly regenerate a new one."
                    };
                }

                if (otp_sts.Equals("v"))
                {
                    int verify_otp_success = con.Execute(
                        $@"UPDATE `otp` set is_verified='y' 
                           WHERE MD5(consult_req_pk)=@consult_req_pk
	                       AND otp_code =@otp_code;"
                        , payload, transaction: tran);

                    if (verify_otp_success > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            message = "The OTP has been verified successfully. You can now start paying your bill."
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "Database error has occured. There were no rows affected when trying to verify the OTP."
                        };
                    }
                }

                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. "
                };
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

        public ResponseModel ResendPayOtp(OtpEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                                 $@"SELECT * FROM (
                                                   SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgcaddress
                                                   FROM `consult_request` cr
                                                   LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                   LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                   LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                   LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                                   WHERE md5(consult_req_pk)=@consult_req_pk limit 1 ;",
                                                 new { payload.consult_req_pk }, transaction: tran);

                //string otp_code = UseOtp.create();
                string otp_code = "111111";

                string full_body = $@"This is {def_val_repo.GetHospitalName().data}. Dear {selected_row.last_name}, {selected_row.ended_at}, your Consultation Request Payment Link OTP is: {otp_code}. This is only valid within 10 minutes.";

                int message_affected_rows = con.Execute($@"INSERT INTO messageout SET
                                                                messageto='${selected_row.mob_no}',
                                                                messagetext=@full_body;"
                                               , new { full_body }, transaction: tran);

                if (message_affected_rows > 0)
                {
                    OtpEntity otp_payload = new OtpEntity
                    {
                        otp_code = otp_code,
                        consult_req_pk = selected_row.consult_req_pk,
                    };

                    int update_otp_success = con.Execute(
                       $@"UPDATE `otp` SET 
                           otp_code=@otp_code,
                           encoded_at=NOW()
                           WHERE consult_req_pk=@consult_req_pk;"
                       , otp_payload, transaction: tran);

                    if (update_otp_success > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            message = $"A new OTP for this payment link has been successfully sent to your mobile number ({selected_row.mob_no})."
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "Database error has occured. There were no rows affected when trying to generate a new OTP."
                        };
                    }

                }

                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. "
                };
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

        public ResponseModel AssignDeptConsult(ConsultRequestEntity payload, string user_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                                  $@"SELECT * FROM (
                                                   SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgcaddress
                                                   FROM `consult_request` cr
                                                   LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                   LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                   LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                   LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                                   WHERE consult_req_pk=@consult_req_pk limit 1 ;",
                                                  new { payload.consult_req_pk }, transaction: tran);

                int update_sts_affected_rows = con.Execute($@"
                                        UPDATE `consult_request` SET 
                                        assign_dept_pk =@assign_dept_pk,
                                        assign_res_pk =@assign_res_pk,
                                        assign_dept_consult_date=@assign_dept_consult_date,
                                        assign_dept_at=NOW()
                                        WHERE consult_req_pk=@consult_req_pk;
                            ", payload, transaction: tran);

                DepartmentEntity dept_info = con.QuerySingle<DepartmentEntity>(
                    $@"SELECT * FROM `department` where `dept_pk`=@dept_pk;"
                    , new { dept_pk = payload.assign_dept_pk }, transaction: tran);

                if (update_sts_affected_rows > 0)
                {
                    LogModel log_payload = new LogModel
                    {
                        activity = $"the consultation request {selected_row.consult_req_pk} has been assigned to {dept_info.dept_code} - {dept_info.dept_name}!",
                        encoded_by = user_pk,
                        ref_pk = selected_row.consult_req_pk,
                        ref_table = "consult_request"
                    };


                    int insert_logs_affected_rows = con.Execute(
                            $@"INSERT into logs set
                             ref_pk=@ref_pk,
                             ref_table=@ref_table,
                             activity=@activity,
                             encoded_at = NOW(),
                             encoded_by=@encoded_by;
                            ", log_payload, transaction: tran);

                    if (insert_logs_affected_rows > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            message = $"The consultation request {selected_row.consult_req_pk} has been assigned to {dept_info.dept_code} - {dept_info.dept_name}!",
                            success = true
                        };

                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "No affected rows in the process."
                    };
                }


                return new ResponseModel
                {
                    success = false,
                    message = "Some error occured during the process."
                };

            }
            catch (Exception err)
            {

                return new ResponseModel
                {
                    success = false,
                    message = err.Message
                };
            }
        }

        public ResponseModel PreviewConsultSoa(string consult_req_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                                  $@"SELECT * FROM (
                                                   SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgcaddress
                                                   FROM `consult_request` cr
                                                   LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                   LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                   LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                   LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                                   WHERE consult_req_pk=@consult_req_pk limit 1 ;",
                                                  new { consult_req_pk }, transaction: tran);

                string brand_logo = def_val_repo.GetHospitalLogo().data.ToString();
                string brand_name = def_val_repo.GetHospitalName().data.ToString();
                string brand_email = def_val_repo.GetHospitalName().data.ToString();
                string brand_phone = def_val_repo.GetHospitalPhone().data.ToString();
                string brand_address = def_val_repo.GetHospitalAddress().data.ToString();

                string soa_qr = UseQr.CreateConsultSoaQr(selected_row.hash_key, brand_logo);

                byte[] soa_pdf = SoaPdf.GenerateSoaPdf(brand_name, brand_logo, brand_address, brand_phone, brand_email, selected_row, soa_qr);

                string pdf_file = Convert.ToBase64String(soa_pdf);

                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = pdf_file
                };
            }
            catch (Exception err)
            {

                return new ResponseModel
                {
                    success = false,
                    message = err.Message
                };
            }
        }

        public ResponseModel EmailConsultRequestSoa(ConsultRequestEntity payload, string user_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                                  $@"SELECT * FROM (
                                                   SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgcaddress
                                                   FROM `consult_request` cr
                                                   LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                   LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                   LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                   LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                                   WHERE consult_req_pk=@consult_req_pk limit 1 ;",
                                                  new { payload.consult_req_pk }, transaction: tran);

                int update_consult_res = con.Execute($@"
                                        UPDATE `consult_request` SET 
                                        soa_sent_count = (soa_sent_count + 1)
                                        WHERE consult_req_pk=@consult_req_pk;
                            ", new { selected_row.consult_req_pk }, transaction: tran);

                if (update_consult_res > 0)
                {
                    LogModel log_payload = new LogModel
                    {
                        activity = $"the consultation request {selected_row.consult_req_pk} Statement of Account (SOA) has been emailed to {selected_row.email}.",
                        encoded_by = user_pk,
                        ref_pk = selected_row.consult_req_pk,
                        ref_table = "consult_request"
                    };


                    int insert_logs_affected_rows = con.Execute(
                            $@"INSERT into logs set
                             ref_pk=@ref_pk,
                             ref_table=@ref_table,
                             activity=@activity,
                             encoded_at = NOW(),
                             encoded_by=@encoded_by;
                            ", log_payload, transaction: tran);

                    if (insert_logs_affected_rows > 0)
                    {
                        string brand_name = def_val_repo.GetHospitalName().data.ToString();
                        string brand_initial = def_val_repo.GetHospitalInitial().data.ToString();

                        byte[] soa_pdf = Convert.FromBase64String(payload.attach_base64_soa);

                        string email_message = $"Greetings {selected_row.first_name} from {brand_name}. This is the Statement of Account (SOA) of your consultation request {selected_row.consult_req_pk}.";

                        ResponseModel email_response = UseEmail.SendEmailAttachment(brand_name,
                            selected_row.email,
                            email_message,
                            $"{brand_initial} Online Consultation Statement of Account (SOA)",
                            $"SOA-{selected_row.consult_req_pk}",
                           soa_pdf);
                        if (!email_response.success)
                        {
                            return email_response;
                        }

                        tran.Commit();
                        return new ResponseModel
                        {
                            message = $"The consultation request {selected_row.consult_req_pk} Statement of Account (SOA) has been emailed to {selected_row.email}.",
                            success = true
                        };

                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "No affected rows in the process."
                    };
                }


                return new ResponseModel
                {
                    success = false,
                    message = "Some error occured during the process."
                };

            }
            catch (Exception err)
            {

                return new ResponseModel
                {
                    success = false,
                    message = err.Message
                };
            }
        }

        public ResponseModel ChangeConsultationCost(ConsultRequestEntity payload, string user_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                                  $@"SELECT * FROM (
                                                   SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgcaddress
                                                   FROM `consult_request` cr
                                                   LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                   LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                   LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                   LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                                   WHERE consult_req_pk=@consult_req_pk limit 1 ;",
                                                  new { payload.consult_req_pk }, transaction: tran);

                if (selected_row.sts_pk.Equals("fa") && selected_row.pay_at == null && selected_row.paymongo_paid_at == null)
                {
                    int update_consult_req = con.Execute($@"
                                        UPDATE `consult_request` SET 
                                        consult_cost =@consult_cost
                                        WHERE consult_req_pk=@consult_req_pk;
                            ", payload, transaction: tran);

                    if (update_consult_req > 0)
                    {
                        LogModel log_payload = new LogModel
                        {
                            activity = $"the cost of the consultation request {selected_row.consult_req_pk} has been changed to {payload.consult_cost}!",
                            encoded_by = user_pk,
                            ref_pk = selected_row.consult_req_pk,
                            ref_table = "consult_request"
                        };


                        int insert_logs_affected_rows = con.Execute(
                                $@"INSERT into logs set
                                 ref_pk=@ref_pk,
                                 ref_table=@ref_table,
                                 activity=@activity,
                                 encoded_at = NOW(),
                                 encoded_by=@encoded_by;
                            ", log_payload, transaction: tran);

                        if (insert_logs_affected_rows > 0)
                        {
                            tran.Commit();
                            return new ResponseModel
                            {
                                message = $"The cost of the consultation request {selected_row.consult_req_pk} has been changed to {payload.consult_cost}!",
                                success = true
                            };
                        }
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "No affected rows in the process."
                        };
                    }

                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "The cost of this consultation can no longer be changed!"
                    };
                }



                return new ResponseModel
                {
                    success = false,
                    message = "Some error occured during the process."
                };

            }
            catch (Exception err)
            {

                return new ResponseModel
                {
                    success = false,
                    message = err.Message
                };
            }
        }

        public ResponseModel StartConsultation(HospPatientEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                             $@"SELECT * FROM (
                                                   SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgcaddress
                                                   FROM `consult_request` cr
                                                   LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                   LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                   LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                   LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                                   WHERE consult_req_pk=@consult_req_pk limit 1 ;",
                                             new { payload.consult_req_pk }, transaction: tran);

                int patient_success = 0;

                //string consult_link_pass = UseOtp.create();
                string consult_link_pass = "111111";
                string consult_link_hash = UseHash.Sha256(consult_link_pass);

                int update_consult = con.Execute($@"
                        UPDATE `consult_request` SET
                        sts_pk='s',
                        consult_link_pass='{consult_link_pass}',
                        consult_link_hash='{consult_link_hash}',
                        consult_at=NOW()
                        WHERE consult_req_pk = @consult_req_pk;
                        ", payload, transaction: tran);

                if (selected_row.hospital_no != null)
                {
                    patient_success = con.Execute(@"
                        UPDATE `hosp_patient` SET
                        prefix=@prefix,
                        first_name=@first_name,
                        middle_name=@middle_name,
                        last_name=@last_name,
                        suffix=@suffix,
                        birth_date=@birth_date,
                        birth_place=@birth_place,
                        cs_pk=@cs_pk,
                        nat_pk=@nat_pk,
                        rel_pk=@rel_pk,
                        email=@email,
                        mob_no=@mob_no,
                        line1=@line1,
                        line2=@line2,
                        brgy_pk=@brgy_pk,
                        citymun_pk=@citymun_pk,
                        prov_pk=@prov_pk,
                        region_pk=@region_pk,
                        zip_code=@zip_code,
                        consult_count=(consult_count+1),
                        last_consult_at=NOW(),
                        last_updated_at=NOW(),
                        last_updated_by=@last_updated_by
                        WHERE hospital_no=@hospital_no;
                        ", payload, transaction: tran);
                }
                else
                {
                    payload.hospital_no = con.QuerySingle<string>($@"
                                    SELECT next_hospital_no(NULL);
                                    ", null, transaction: tran);

                    patient_success = con.Execute(@"
                        INSERT INTO `hosp_patient` SET
                        hospital_no=@hospital_no,
                        prefix=@prefix,
                        first_name=@first_name,
                        middle_name=@middle_name,
                        last_name=@last_name,
                        birth_date=@birth_date,
                        birth_place=@birth_place,
                        cs_pk=@cs_pk,
                        nat_pk=@nat_pk,
                        rel_pk=@rel_pk,
                        email=@email,
                        mob_no=@mob_no,
                        line1=@line1,
                        line2=@line2,
                        brgy_pk=@brgy_pk,
                        citymun_pk=@citymun_pk,
                        prov_pk=@prov_pk,
                        region_pk=@region_pk,
                        zip_code=@zip_code,
                        consult_count=1,
                        last_consult_at=NOW(),
                        last_updated_at=NOW(),
                        last_updated_by=@last_updated_by;
                        ", payload, transaction: tran);
                }


                if (update_consult > 0 && patient_success > 0)
                {
                    string brand_name = def_val_repo.GetHospitalName().data.ToString();
                    string msg_body = $@"This is {brand_name}. Dear {selected_row.last_name}, {selected_row.first_name}, 
                                         kindly attend your online consultation at {DefaultConfig._clientBaseUrl}online-consultation/{selected_row.hash_key} using the password {consult_link_pass}.";

                    int message_sent = con.Execute($@"INSERT INTO messageout SET
                                                              messageto='${selected_row.mob_no}',
                                                              messagetext=@messagetext;",
                                                      new { messageto = selected_row.mob_no, messagetext = msg_body }, transaction: tran);

                    if (message_sent < 1)
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "An error has occured when trying to send the message. Please try again!"
                        };
                    }

                    ResponseModel email_response = UseEmail.SendEmail(brand_name, selected_row.email, msg_body, "Online Consultation Link");

                    if (!email_response.success)
                    {
                        return email_response;

                    }

                    LogModel log_payload = new LogModel
                    {
                        activity = $"the consultation {selected_row.consult_req_pk} has been started",
                        encoded_by = payload.last_updated_by,
                        ref_pk = selected_row.consult_req_pk,
                        ref_table = "consult_request"
                    };

                    int insert_log = con.Execute(
                            $@"INSERT into logs set
                                 ref_pk=@ref_pk,
                                 ref_table=@ref_table,
                                 activity=@activity,
                                 encoded_at = NOW(),
                                 encoded_by=@encoded_by;
                            ", log_payload, transaction: tran);

                    if (insert_log > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            message = "The consultation has been started. The online consultation link has been sent to the patient. "
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "There were no rows affected when trying log the event."
                        };
                    }
                }

                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. The consultation has not been started."
                };
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

        public ResponseModel EndConsult(ConsultRequestEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                             $@"SELECT * FROM (
                                                   SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgcaddress
                                                   FROM `consult_request` cr
                                                   LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                   LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                   LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                   LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                                   WHERE consult_req_pk=@consult_req_pk limit 1 ;",
                                             new { payload.consult_req_pk }, transaction: tran);


                if (selected_row.sts_pk.Equals("s"))
                {
                    int update_consult = con.Execute($@"
                        UPDATE `consult_request` SET
                        sts_pk='e',
                        ended_at=NOW()
                        WHERE consult_req_pk = @consult_req_pk;
                        ", payload, transaction: tran);

                    if (update_consult > 0)
                    {
                        LogModel log_payload = new LogModel
                        {
                            activity = $"the consultation {selected_row.consult_req_pk} has ended.",
                            encoded_by = payload.last_updated_by,
                            ref_pk = selected_row.consult_req_pk,
                            ref_table = "consult_request"
                        };

                        int insert_log = con.Execute(
                                $@"INSERT into logs set
                                 ref_pk=@ref_pk,
                                 ref_table=@ref_table,
                                 activity=@activity,
                                 encoded_at = NOW(),
                                 encoded_by=@encoded_by;
                            ", log_payload, transaction: tran);

                        if (insert_log > 0)
                        {
                            tran.Commit();
                            return new ResponseModel
                            {
                                success = true,
                                message = "The consultation has ended."
                            };
                        }
                        else
                        {
                            return new ResponseModel
                            {
                                success = false,
                                message = "There were no rows affected when trying log the event."
                            };
                        }
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "There were no rows affected when trying to end the consultation"
                        };
                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "You can't end consultations that are not currently started!"
                    };
                }
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

        public ResponseModel TakeOverConsult(ConsultRequestEntity payload, string user_type)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                             $@"SELECT * FROM (
                                                   SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgcaddress
                                                   FROM `consult_request` cr
                                                   LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                   LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                   LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                   LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                                   WHERE consult_req_pk=@consult_req_pk limit 1 ;",
                                             new { payload.consult_req_pk }, transaction: tran);

                if (user_type.Equals("hosp_resident"))
                {
                    if (selected_row.sts_pk.Equals("pd") && selected_row.assign_res_pk == null)
                    {
                        int update_consult = con.Execute($@"
                        UPDATE `consult_request` SET
                        assign_res_pk=(SELECT res_pk FROM `hosp_resident` WHERE user_pk = @last_updated_by LIMIT 1)
                        WHERE consult_req_pk = @consult_req_pk;
                        ", payload, transaction: tran);

                        var resident_info = con.QuerySingle<HospResidentEntity>(
                            $@"SELECT * FROM `hosp_resident` WHERE res_pk=(SELECT res_pk FROM `hosp_resident` WHERE user_pk = @last_updated_by LIMIT 1);",
                            payload,
                            transaction: tran);

                        if (update_consult > 0)
                        {
                            LogModel log_payload = new LogModel
                            {
                                activity = $"the resident {resident_info.last_name}, {resident_info.first_name} has taken over the consulation {selected_row.consult_req_pk}.",
                                encoded_by = payload.last_updated_by,
                                ref_pk = selected_row.consult_req_pk,
                                ref_table = "consult_request"
                            };

                            int insert_log = con.Execute(
                                    $@"INSERT into logs set
                                       ref_pk=@ref_pk,
                                       ref_table=@ref_table,
                                       activity=@activity,
                                       encoded_at = NOW(),
                                       encoded_by=@encoded_by;
                            ", log_payload, transaction: tran);

                            if (insert_log > 0)
                            {
                                tran.Commit();
                                return new ResponseModel
                                {
                                    success = true,
                                    message = $@"The resident {resident_info.last_name}, {resident_info.first_name} has taken over the consulation {selected_row.consult_req_pk}."
                                };
                            }
                            else
                            {
                                return new ResponseModel
                                {
                                    success = false,
                                    message = "There were no rows affected when trying log the event."
                                };
                            }
                        }
                        else
                        {
                            return new ResponseModel
                            {
                                success = false,
                                message = "There were no rows affected when trying to end the consultation"
                            };
                        }
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "You can't take over this consultation!"
                        };
                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "You are not allowed to take over this consultation."
                    };
                }


            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

        public ResponseModel MapConsultationToPatient(HospPatientEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                             $@"SELECT * FROM (
                                                   SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgcaddress
                                                   FROM `consult_request` cr
                                                   LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                   LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                   LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                   LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                                   WHERE consult_req_pk=@consult_req_pk limit 1 ;",
                                             new { payload.consult_req_pk }, transaction: tran);


                int update_consult = con.Execute(@"
                        UPDATE `consult_request` SET
                        hospital_no=@hospital_no
                        WHERE consult_req_pk = @consult_req_pk;
                        ", payload, transaction: tran);

                int patient_success = con.Execute(@"
                        UPDATE `hosp_patient` SET
                        prefix=@prefix,
                        first_name=@first_name,
                        middle_name=@middle_name,
                        last_name=@last_name,
                        suffix=@suffix,
                        birth_date=@birth_date,
                        birth_place=@birth_place,
                        cs_pk=@cs_pk,
                        nat_pk=@nat_pk,
                        rel_pk=@rel_pk,
                        email=@email,
                        mob_no=@mob_no,
                        line1=@line1,
                        line2=@line2,
                        brgy_pk=@brgy_pk,
                        citymun_pk=@citymun_pk,
                        prov_pk=@prov_pk,
                        region_pk=@region_pk,
                        zip_code=@zip_code,
                        consult_count=(consult_count+1),
                        last_consult_at=NOW(),
                        last_updated_at=NOW(),
                        last_updated_by=@last_updated_by
                        WHERE hospital_no=@hospital_no;
                        ", payload, transaction: tran);

                if (update_consult > 0 && patient_success > 0)
                {
                    LogModel log_payload = new LogModel
                    {
                        activity = $"the consultation request {selected_row.consult_req_pk} has been mapped to the the hospital records",
                        encoded_by = payload.last_updated_by,
                        ref_pk = selected_row.consult_req_pk,
                        ref_table = "consult_request"
                    };

                    int insert_logs_affected_rows = con.Execute(
                            $@"INSERT into logs set
                                 ref_pk=@ref_pk,
                                 ref_table=@ref_table,
                                 activity=@activity,
                                 encoded_at = NOW(),
                                 encoded_by=@encoded_by;
                            ", log_payload, transaction: tran);

                    if (insert_logs_affected_rows > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            message = $"The consultation request {selected_row.consult_req_pk} has been mapped to the the hospital records!",
                            success = true
                        };
                    }
                }

                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. The consultation has not been started."
                };
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

        public ResponseModel AuthenticateConsultLink(ConsultRequestEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                             $@"SELECT * FROM (
                                                   SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgcaddress
                                                   FROM `consult_request` cr
                                                   LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                   LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                   LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                   LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                                   WHERE MD5(consult_req_pk)=@hash_key limit 1 ;",
                                             new { payload.hash_key }, transaction: tran);

                payload.consult_link_hash = UseHash.Sha256(payload.consult_link_pass);

                if (payload.consult_link_hash.Equals(selected_row.consult_link_hash))
                {
                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        data = payload.consult_link_hash,
                        message = "You have been authenticated successfully."
                    };
                }

                return new ResponseModel
                {
                    success = false,
                    message = "The consultation link password that you have entered is not correct!"
                };
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

        public ResponseModel IsConsultLinkAuthenticated(ConsultRequestEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                             $@"SELECT * FROM (
                                                   SELECT cr.*,md5(cr.consult_req_pk) hash_key, r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc, psg.`completeaddress` psgcaddress
                                                   FROM `consult_request` cr
                                                   LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                   LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                   LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                   LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`) AS tmp
                                                   WHERE MD5(consult_req_pk)=@hash_key limit 1 ;",
                                             new { payload.hash_key }, transaction: tran);

                if (payload.consult_link_hash.Equals(selected_row.consult_link_hash))
                {
                    return new ResponseModel
                    {
                        success = true,
                    };
                }

                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. The consultation has not been started."
                };
            }
            catch (Exception err)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

        public ResponseModel GetCosultLinkInfo(string hash_key)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<ConsultRequestEntity> table_data = con.Query<ConsultRequestEntity>($@"
                      SELECT * FROM (
                      SELECT cr.consult_req_pk,cr.consult_at,cr.prefix,cr.first_name,cr.middle_name,cr.last_name,cr.suffix,cr.sts_pk,cr.consult_link_hash
                      ,CONCAT( hr.`last_name`,', ',hr.`first_name`,IF(hr.`suffix` IS NULL, '',CONCAT(' ',hr.`suffix`))) AS `assign_res_desc`
                      FROM `consult_request` cr
                      LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                      LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                      LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                      LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`
                      LEFT JOIN `department` d ON d.`dept_pk` = cr.`assign_dept_pk`
                      LEFT JOIN `hosp_resident` hr ON hr.`res_pk` = cr.`assign_res_pk`
                      ) AS tmp
                      WHERE MD5(consult_req_pk)=@hash_key LIMIT 1;"
                      , new { hash_key }, transaction: tran).ToList();

                if (table_data.Count > 0)
                {
                    ConsultRequestEntity selected_row = table_data[0];
                    selected_row.status = con.QuerySingleOrDefault<StatusMasterEntity>(
                        "select * from status_master where sts_pk=@sts_pk"
                        , new { selected_row.sts_pk }
                        , transaction: tran);

                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        data = selected_row
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "The record that you are trying to retrieve does not exist!"
                    };
                }
            }
            catch (Exception err)
            {

                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

    }
}
