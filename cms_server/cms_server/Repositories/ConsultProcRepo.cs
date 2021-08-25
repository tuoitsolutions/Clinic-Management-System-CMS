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
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using static cms_server.Payloads.ConsultProcPayloads;

namespace cms_server.Repositories
{
    public class ConsultProcRepo
    {
        DefValRepo def_val_repo = new DefValRepo();


        public ResponseModel InsertConsultProc(ConsultProcEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                int add_dept = con.Execute(@"
                        INSERT INTO `consult_req_proc` SET
                        consult_req_pk=@consult_req_pk,
                        proc_no=@proc_no,
                        proc_desc=@proc_desc,
                        notes=@notes,
                        is_active=@is_active,
                        encoded_at=NOW(),
                        encoder_pk=@encoder_pk;
                        ", payload, transaction: tran);

                if (add_dept > 0)
                {
                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        message = $"The item has been added successfully!"
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"There are no rows affected when trying to add the item!"
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

        public ResponseModel UpdateConsultProc(ConsultProcEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                int edit_dept = con.Execute(@"
                        UPDATE `consult_req_proc` SET
                        proc_no=@proc_no,
                        proc_desc=@proc_desc,
                        notes=@notes,
                        is_active=@is_active,
                        encoded_at=NOW(),
                        encoder_pk=@encoder_pk
                        WHERE cr_proc_pk=@cr_proc_pk;
                        ", payload, transaction: tran);


                if (edit_dept > 0)
                {

                    LogModel log_payload = new LogModel
                    {
                        activity = $"The vital sign with ID {payload.cr_proc_pk} has been updated!",
                        encoded_by = payload.encoder_pk,
                        ref_pk = payload.cr_proc_pk.ToString(),
                        ref_table = "consult_req_proc"
                    };

                    int inserted_log = con.Execute($@"
                                         insert into logs set
                                         ref_pk=@ref_pk,
                                         ref_table=@ref_table,
                                         activity=@activity,
                                         encoded_at = now(),
                                         encoded_by=@encoded_by;
                                        "
                                , log_payload, transaction: tran);


                    if (inserted_log > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            message = $"The item has been updated successfully!"
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = $"There are no rows affected when audit the action!"
                        };
                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"There are no rows affected when trying to update the item!"
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

        public ResponseModel GetTableConsultProc(ConsultProcTablePayload payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<ConsultProcEntity> table_data = con.Query<ConsultProcEntity>($@"
                                       SELECT * FROM (
                                        SELECT * FROM `consult_req_proc`
                                        ) AS view_tmp
                                       WHERE
                                       `consult_req_pk` = @consult_req_pk
                                       AND COALESCE(proc_desc,'') LIKE CONCAT('%',@proc_desc,'%')
                                       AND is_active IN @is_active
                                       {UseFilter.GenWhereDateClause("encoded_at", ">=", payload.filters.date_from)} 
                                       {UseFilter.GenWhereDateClause("encoded_at", "<=", payload.filters.date_to)} 
                                       {UseFilter.GenTablePagination(payload.sort, payload.page)}
                            ", payload.filters, transaction: tran).ToList();

                bool has_more = table_data.Count > payload.page.limit;

                if (has_more)
                {
                    table_data.RemoveAt(table_data.Count - 1);
                }

                int count = has_more ? -1 : payload.page.begin * payload.page.limit + table_data.Count;

                return new ResponseModel
                {
                    success = true,
                    data =
                    new
                    {
                        table = table_data,
                        payload.page.begin,
                        count,
                        payload.page.limit
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

        public ResponseModel GetConsultProcByPk(string id)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<ConsultProcEntity> table_data = con.Query<ConsultProcEntity>(
                    $@"SELECT * FROM consult_req_proc where cr_proc_pk=@id limit 1;",
                    new { id }, transaction: tran).ToList();

                if (table_data.Count > 0)
                {
                    ConsultProcEntity selected_admin = table_data[0];

                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        data = selected_admin
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "The item that you are trying to retrieve does not exist!"
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

        public ResponseModel PreviewProcPrescrip(string consult_req_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                ConsultRequestEntity selected_row = con.QuerySingle<ConsultRequestEntity>(
                                                  $@"SELECT * FROM (
                                                     SELECT cr.*,MD5(cr.consult_req_pk) hash_key
                                                     ,r.`description` rel_desc, n.`nationality` nat_desc, cs.`csdesc` cs_desc
                                                     ,psg.`citymundesc`,psg.`provincedesc`,psg.`barangaydesc`,psg.`regiondesc`,psg.`completeaddress` psgcaddress
                                                     ,CONCAT(d.dept_code,'-',d.dept_name) AS `assign_dept_desc`
                                                     ,CONCAT( hr.`last_name`,', ',hr.`first_name`,IF(hr.`suffix` IS NULL, '',CONCAT(' ',hr.`suffix`))) AS `assign_res_desc`
                                                     ,calc_age(birth_date) AS age
                                                     FROM `consult_request` cr
                                                     LEFT JOIN `religion` r ON cr.`rel_pk` = r.`rel_pk`
                                                     LEFT JOIN `nationality` n ON n.`nat_pk` = cr.`nat_pk`
                                                     LEFT JOIN `civilstatus` cs ON cs.`cskey` = cr.`cs_pk`
                                                     LEFT JOIN `psgcaddress` psg ON psg.`barangaycode` =cr.`brgy_pk`
                                                     LEFT JOIN `department` d ON d.`dept_pk` = cr.`assign_dept_pk`
                                                     LEFT JOIN `hosp_resident` hr ON hr.`res_pk` = cr.`assign_res_pk`
                                                     ) AS tmp
                                                     WHERE consult_req_pk=@consult_req_pk LIMIT 1 ;",
                                                  new { consult_req_pk }, transaction: tran);

                string brand_logo = def_val_repo.GetHospitalLogo().data.ToString();
                string brand_name = def_val_repo.GetHospitalName().data.ToString();
                string brand_email = def_val_repo.GetHospitalName().data.ToString();
                string brand_phone = def_val_repo.GetHospitalPhone().data.ToString();
                string brand_address = def_val_repo.GetHospitalAddress().data.ToString();

                List<ConsultProcEntity> prescrip_proc = con.Query<ConsultProcEntity>(
                                                  $@"SELECT * FROM `consult_req_proc` WHERE 
                                                     is_active ='y' AND `consult_req_pk` = @consult_req_pk;",
                                                  new { consult_req_pk }, transaction: tran).ToList();

                string soa_qr = UseQr.CreateConsultSoaQr(selected_row.hash_key, brand_logo);

                byte[] soa_pdf = ProcPrescrip.GenerateSoaPdf(brand_name, brand_logo, brand_address, brand_phone, brand_email, selected_row, soa_qr, prescrip_proc);

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

        public ResponseModel EmailProcPrescrip(ConsultProcEntity payload, string user_pk)
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
                                        proc_pres_sent = (proc_pres_sent + 1)
                                        WHERE consult_req_pk=@consult_req_pk;
                            ", new { selected_row.consult_req_pk }, transaction: tran);

                if (update_consult_res > 0)
                {
                    LogModel log_payload = new LogModel
                    {
                        activity = $"the consultation {selected_row.consult_req_pk} Procedure Prescription has been emailed to {selected_row.email}.",
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

                        byte[] pdf = Convert.FromBase64String(payload.attach_file);

                        string email_message = $"Greetings {selected_row.first_name} from {brand_name}. This is the Procedure Prescription of your consultation {selected_row.consult_req_pk}.";

                        ResponseModel email_response = UseEmail.SendEmailAttachment(brand_name,
                            selected_row.email,
                            email_message,
                            $"{brand_initial} Procedure Prescription",
                            $"Proecure-Prescription-{selected_row.consult_req_pk}",
                           pdf);
                        if (!email_response.success)
                        {
                            return email_response;
                        }

                        tran.Commit();
                        return new ResponseModel
                        {
                            message = $"The consultation {selected_row.consult_req_pk} Procedure Prescription has been emailed to {selected_row.email}.",
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
    }
}
