using cms_server.Entities;
using Dapper;
using ddt_server.Config;
using ddt_server.Hooks;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using System;

namespace cms_server.Repositories
{
    public class ConsultChatRepo
    {
        public ResponseModel InsertConsultChat(ConsultReqChatEntity payload, string user_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                if (user_pk != null && payload.user_type.Equals("hosp_resident"))
                {
                    payload.sender_pk = user_pk;
                }


                if (payload?.attached_files != null)
                {
                    foreach (var f in payload.attached_files)
                    {

                        FileResponseModel file_upload_response = new FileResponseModel
                        {
                            success = true
                        };

                        var proc_file_payload = new ConsultRequestFileEntity()
                        {
                            consult_req_pk = payload.consult_req_pk
                        };

                        file_upload_response = UseFtp.UploadToFtp(f, DefaultConfig.ftp_ip, $"/{DefaultConfig.app_name}/Uploads/ConsultationFiles/{payload.consult_req_pk}/", DefaultConfig.ftp_user, DefaultConfig.ftp_pass);

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
                            proc_file_payload.file_ext = file_upload_response.data.ext;
                        }


                        proc_file_payload.consult_req_pk = payload.consult_req_pk;

                        if (!String.IsNullOrEmpty(user_pk) && payload.user_type.Equals("hosp_resident"))
                        {
                            payload.sender_pk = user_pk;
                        }

                        int cr_file_pk = con.QuerySingle<int>($@"
                                INSERT INTO `consult_request_file` 
                                SET 
                                consult_req_pk=@consult_req_pk,
                                file_dest=@file_dest, 
                                file_name=@file_name, 
                                file_type='send via chat', 
                                file_ext=@file_ext, 
                                notes='', 
                                is_active='y', 
                                encoded_at=NOW(),
                                encoded_by='{payload.sender_pk}';
                                SELECT LAST_INSERT_ID();",
                            proc_file_payload, transaction: tran);


                        payload.cr_file_pk = cr_file_pk;
                        int insert_chat = con.Execute($@"
                         INSERT INTO  `consult_req_chat` SET
                         consult_req_pk=@consult_req_pk,
                         cr_file_pk=@cr_file_pk,
                         msg_body='{proc_file_payload.file_name + proc_file_payload.file_ext}',
                         sent_at=NOW(),
                         shown='y',
                         sender_pk=@sender_pk,
                         user_type=@user_type,
                         sender_name=@sender_name;
                        ", payload, transaction: tran);

                        if (payload.cr_file_pk <= 0 || insert_chat <= 0)
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

                if (!String.IsNullOrEmpty(payload.msg_body))
                {
                    int insert_row = con.Execute(@"
                         INSERT INTO  `consult_req_chat` SET
                         consult_req_pk=@consult_req_pk,
                         msg_body=@msg_body,
                         sent_at=NOW(),
                         shown='y',
                         sender_pk=@sender_pk,
                         user_type=@user_type,
                         sender_name=@sender_name;
                        ", payload, transaction: tran);

                    if (insert_row <= 0)
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = $"There are no rows affected when trying to send the message!"
                        };
                    }

                }

                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    message = $"Your message has been sent!"
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

        public ResponseModel GetConsultChat(string consult_req_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                var tbl_data = con.Query<ConsultReqChatEntity>(@"
                        SELECT * FROM `consult_req_chat` where consult_req_pk=@consult_req_pk;
                        ", new { consult_req_pk }, transaction: tran);

                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = tbl_data
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
    }
}
