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
using static cms_server.Payloads.ConsultMedPayloads;

namespace cms_server.Repositories
{
    public class ConsultMedRepo
    {
        DefValRepo def_val_repo = new DefValRepo();

        public ResponseModel InsertConsultMed(ConsultMedEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                int add_dept = con.Execute(@"
                        INSERT INTO `consult_req_med` SET
                        consult_req_pk=@consult_req_pk,
                        med_no=@med_no,
                        med_desc=@med_desc,
                        unit=@unit,
                        dosage=@dosage,
                        duration=@duration,
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

        public ResponseModel UpdateConsultMed(ConsultMedEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                int edit_dept = con.Execute(@"
                        UPDATE `consult_req_med` SET
                        med_no=@med_no,
                        med_desc=@med_desc,
                        unit=@unit,
                        dosage=@dosage,
                        is_active=@is_active,
                        encoded_at=NOW(),
                        encoder_pk=@encoder_pk
                        WHERE cr_med_pk=@cr_med_pk;
                        ", payload, transaction: tran);


                if (edit_dept > 0)
                {

                    LogModel log_payload = new LogModel
                    {
                        activity = $"The vital sign with ID {payload.cr_med_pk} has been updated!",
                        encoded_by = payload.encoder_pk,
                        ref_pk = payload.cr_med_pk.ToString(),
                        ref_table = "consult_req_med"
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

        public ResponseModel GetTableConsultMed(ConsultMedTablePayload payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<ConsultMedEntity> table_data = con.Query<ConsultMedEntity>($@"
                                       SELECT * FROM (
                                        SELECT * FROM `consult_req_med`
                                        ) AS view_tmp
                                       WHERE
                                       `consult_req_pk` = @consult_req_pk
                                       AND COALESCE(med_desc,'') LIKE CONCAT('%',@med_desc,'%')
                                       AND COALESCE(dosage,'') LIKE CONCAT('%',@dosage,'%')
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

        public ResponseModel GetConsultMedByPk(string id)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<ConsultMedEntity> table_data = con.Query<ConsultMedEntity>(
                    $@"SELECT * FROM consult_req_med where cr_med_pk=@id limit 1;",
                    new { id }, transaction: tran).ToList();

                if (table_data.Count > 0)
                {
                    ConsultMedEntity selected_admin = table_data[0];

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

        public ResponseModel PreviewMedPrescrip(string consult_req_pk, string user_pk)
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



                string user_res_pk = con.QuerySingle<string>(
                                        $@"SELECT get_user_res_pk(@user_pk)",
                                        new { user_pk }, transaction: tran);

                if (selected_row?.assign_res_pk == user_res_pk && !String.IsNullOrEmpty(user_res_pk) && !String.IsNullOrEmpty(selected_row.assign_res_pk))
                {

                    string brand_logo = def_val_repo.GetHospitalLogo().data.ToString();
                    string brand_name = def_val_repo.GetHospitalName().data.ToString();
                    string brand_email = def_val_repo.GetHospitalName().data.ToString();
                    string brand_phone = def_val_repo.GetHospitalPhone().data.ToString();
                    string brand_address = def_val_repo.GetHospitalAddress().data.ToString();

                    selected_row.assigned_resident_info = con.QuerySingleOrDefault<HospResidentEntity>(
                                                  $@"SELECT r.*,
                                                     CONCAT(r.`first_name`,`concat_nullable_string`(r.`middle_name`,' '),' ',r.`last_name`,`concat_nullable_string`(r.`suffix`,' '),`concat_nullable_string`(r.`doc_title`,', ')) res_name
                                                     FROM `hosp_resident` r WHERE r.res_pk = @res_pk;",
                                                  new { res_pk = selected_row.assign_res_pk }, transaction: tran);

                    List<ConsultMedEntity> prescrip_meds = con.Query<ConsultMedEntity>(
                                                      $@"SELECT * FROM `consult_req_med` WHERE 
                                                     is_active ='y' AND `consult_req_pk` = @consult_req_pk;",
                                                      new { consult_req_pk }, transaction: tran).ToList();

                    string soa_qr = UseQr.CreateConsultSoaQr(selected_row.hash_key, brand_logo);

                    string resident_esignature_img = "";
                    byte[] img_byte_arr = UseFtp.DownloadFtp(DefaultConfig.ftp_ip + selected_row.assigned_resident_info.esignature_dest, DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
                    if (img_byte_arr != null)
                    {
                        resident_esignature_img = "data:image/png;base64," + Convert.ToBase64String(img_byte_arr);
                    }

                    byte[] soa_pdf = MedPrescrip.GenerateSoaPdf(brand_name, brand_logo, brand_address, brand_phone, brand_email, selected_row, soa_qr, prescrip_meds, resident_esignature_img);
                    string watermarked_pdf = UsePdf.AttachWatermarkImage(brand_logo, 0.05f, soa_pdf);

                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        data = watermarked_pdf
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "Only the resident that is assigned to this consultation is allowed to perform this action."
                    };
                }


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


        public ResponseModel EmailMedPrescrip(ConsultMedEntity payload, string user_pk)
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


                string user_res_pk = con.QuerySingle<string>(
                                     $@"SELECT get_user_res_pk(@user_pk)",
                                     new { user_pk }, transaction: tran);

                if (selected_row?.assign_res_pk == user_res_pk && !String.IsNullOrEmpty(user_res_pk) && !String.IsNullOrEmpty(selected_row.assign_res_pk))
                {
                    int update_consult_res = con.Execute($@"
                                        UPDATE `consult_request` SET 
                                        med_pres_sent = (med_pres_sent + 1)
                                        WHERE consult_req_pk=@consult_req_pk;
                            ", new { selected_row.consult_req_pk }, transaction: tran);

                    if (update_consult_res > 0)
                    {
                        LogModel log_payload = new LogModel
                        {
                            activity = $"the consultation {selected_row.consult_req_pk} Medical Prescription has been emailed to {selected_row.email}.",
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

                            string email_message = $"Greetings {selected_row.first_name} from {brand_name}. This is the Medical Prescription of your consultation {selected_row.consult_req_pk}.";

                            ResponseModel email_response = UseEmail.SendEmailAttachment(brand_name,
                                selected_row.email,
                                email_message,
                                $"{brand_initial} Medical Prescription",
                                $"Medical-Prescription-{selected_row.consult_req_pk}",
                               pdf);
                            if (!email_response.success)
                            {
                                return email_response;
                            }

                            tran.Commit();
                            return new ResponseModel
                            {
                                message = $"The consultation {selected_row.consult_req_pk} Medical Prescription has been emailed to {selected_row.email}.",
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
                        message = "Only the resident that is assigned to this consultation is allowed to perform this action."
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
