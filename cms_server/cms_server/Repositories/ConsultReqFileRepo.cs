using cms_server.Entities;
using Dapper;
using ddt_server.Config;
using ddt_server.Hooks;
using ddt_server.Models;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Hooks;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using pos_server.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using static pos_server.Payloads.ConsultRequestFilePayloads;

namespace cms_server.Repositories
{
    public class ConsultReqFileRepo
    {

        public ResponseModel GetTableConsultReqFile(ConsultRequestFileTablePayload payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<ConsultRequestFileEntity> table_data = con.Query<ConsultRequestFileEntity>($@"
                                       SELECT * FROM `consult_request_file`
                                       WHERE
                                       consult_req_pk=@consult_req_pk
                                       AND COALESCE(file_name,'') LIKE CONCAT('%',@file_name,'%')
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

        public ResponseModel GetConsultReqFileByPk(string cr_file_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<ConsultRequestFileEntity> table_data = con.Query<ConsultRequestFileEntity>(
                    $@" SELECT * FROM consult_request_file where cr_file_pk=@cr_file_pk limit 1;",
                    new { cr_file_pk }, transaction: tran).ToList();

                if (table_data.Count > 0)
                {
                    ConsultRequestFileEntity selected_admin = table_data[0];

                    byte[] img_byte_arr = UseFtp.DownloadFtp(DefaultConfig.ftp_ip + selected_admin.file_dest, DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
                    if (img_byte_arr != null)
                    {
                        selected_admin.file_dest = Convert.ToBase64String(img_byte_arr);
                    }

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
                        message = "The unit that you are trying to retrieve does not exist!"
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

        public ResponseModel InsertConsultFile(ConsultRequestFileEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<ConsultReqChatEntity> tbl_consult = con.Query<ConsultReqChatEntity>(
                       $@"SELECT * FROM `consult_request` WHERE consult_req_pk = @consult_req_pk LIMIT 1;"
                       , payload
                       , transaction: tran).ToList();

                UserEntity user_info = con.QuerySingle<UserEntity>(
                    $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                    , new { user_pk = payload.encoded_by }
                    , transaction: tran);

                if (tbl_consult.Count > 0)
                {
                    ConsultReqChatEntity selected_consult = tbl_consult[0];


                    if (payload?.attach_file == null)
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "No file has been attached in this request."
                        };
                    }


                    FileResponseModel file_upload_response = new FileResponseModel
                    {
                        success = true
                    };

                    file_upload_response = UseFtp.UploadToFtp(payload.attach_file, DefaultConfig.ftp_ip, $"/{DefaultConfig.app_name}/Uploads/ConsultationFiles/", DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
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
                        payload.file_dest = file_upload_response.data.path;
                        payload.file_name = file_upload_response.data.name;
                        payload.file_ext = file_upload_response.data.ext;
                    }

                    int add_file = con.Execute(@"
                                    INSERT INTO `consult_request_file` 
                                    SET 
                                    consult_req_pk=@consult_req_pk, 
                                    file_dest=@file_dest, 
                                    file_name=@file_name, 
                                    file_type=@file_type, 
                                    file_ext=@file_ext, 
                                    notes=@notes, 
                                    is_active='y', 
                                    encoded_at=NOW(), 
                                    encoded_by=@encoded_by;"
                                   , payload
                                   , transaction: tran);

                    if (add_file > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            message = "The file has been saved successfully!"
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "We are not able to save the file that you are trying to upload."
                        };
                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "We could not find the consultation request that you are trying to manage!"
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

        public ResponseModel UpdateConsultFile(ConsultRequestFileEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<ConsultRequestFileEntity> tbl_consult = con.Query<ConsultRequestFileEntity>(
                       $@"SELECT * FROM `consult_request_file` WHERE cr_file_pk = @cr_file_pk LIMIT 1;"
                       , payload
                       , transaction: tran).ToList();

                UserEntity user_info = con.QuerySingle<UserEntity>(
                    $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                    , new { user_pk = payload.updated_by }
                    , transaction: tran);

                if (tbl_consult.Count > 0)
                {
                    ConsultRequestFileEntity selected_consult = tbl_consult[0];

                    int add_file = con.Execute(@"
                                    UPDATE `consult_request_file` 
                                    SET 
                                    file_name=@file_name, 
                                    file_type=@file_type, 
                                    notes=@notes, 
                                    is_active=@is_active, 
                                    updated_at=NOW(), 
                                    updated_by=@updated_by 
                                    WHERE cr_file_pk = @cr_file_pk; "
                                   , payload
                                   , transaction: tran);

                    if (add_file > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            message = "The file has been updated successfully!"
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "We are not able to update the file that you are trying to upload."
                        };
                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "We could not find the consultation request that you are trying to manage!"
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

        public ResponseModel GetAllFilesForConsult(string consult_req_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<ConsultRequestFileEntity> table_data = con.Query<ConsultRequestFileEntity>($@"
                                       SELECT * FROM `consult_request_file` where consult_req_pk=@consult_req_pk ORDER BY encoded_at DESC;
                            ", new { consult_req_pk }, transaction: tran).ToList();

                return new ResponseModel
                {
                    success = true,
                    data = table_data
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
