using cms_server.Entities;
using Dapper;
using ddt_server.Config;
using ddt_server.Hooks;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Hooks;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using pos_server.Entities;
using pos_server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using static pos_server.Payloads.HospResidentPayloads;

namespace cms_server.Repositories
{
    public class HospResidentRepo
    {
        public ResponseModel InsertHospResident(HospResidentEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();


                UserEntity user = new UserEntity
                {
                    username = payload.doc_id,
                    full_name = $"{payload.last_name}, {payload.first_name}",
                    user_type = "hosp_resident",
                    is_active = "y",
                    encoder_pk = payload.encoder_pk
                };

                payload.user_pk = con.QuerySingle<int>(@$"
                        INSERT INTO users
                        SET
                        username=@username,
                        full_name=@full_name,
                        user_type=@user_type,
                        pass=AES_ENCRYPT('cms',@username),
                        encoded_at=NOW(),
                        encoder_pk=@encoder_pk;
                        SELECT LAST_INSERT_ID();
                        ", user, transaction: tran);

                if (payload.user_pk > 0)
                {
                    FileResponseModel file_upload_response = new FileResponseModel
                    {
                        success = true
                    };

                    if (payload.img_attach != null)
                    {
                        file_upload_response = UseFtp.UploadFtp(payload.img_attach, DefaultConfig.ftp_ip + "/" + DefaultConfig.app_name + "/Uploads/UserPhotos/", DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
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
                            payload.pic_dest = file_upload_response.data.path;
                        }
                    }

                    int add_admin = con.Execute(@"
                        INSERT INTO hosp_resident
                        SET
                        user_pk=@user_pk,
                        doc_id=@doc_id,
                        pic_dest=@pic_dest,
                        spclty_pk=@spclty_pk,
                        prefix=@prefix,
                        first_name=@first_name,
                        middle_name=@middle_name,
                        last_name=@last_name,
                        suffix=@suffix,
                        gender=@gender,
                        bio=@bio,
                        email=@email,
                        mob_no=@mob_no,
                        is_active=@is_active,
                        encoded_at=NOW(),
                        encoder_pk=@encoder_pk;
                        ", payload, transaction: tran);

                    if (add_admin > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            message = $"The administrator {payload.last_name}, {payload.first_name} has been added successfully!"
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = $"There are no rows affected when trying to add the new administrator!"
                        };
                    }
                }
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"There are no rows affected when trying to create a user for the new administrator!"
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

        public ResponseModel UpdateHospResident(HospResidentEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                FileResponseModel file_upload_response = new FileResponseModel
                {
                    success = true
                };

                if (payload.img_attach != null)
                {
                    file_upload_response = UseFtp.UploadFtp(payload.img_attach, DefaultConfig.ftp_ip + "/" + DefaultConfig.app_name + "/Uploads/UserPhotos/", DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
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
                        payload.pic_dest = file_upload_response.data.path;
                    }
                }

                int edit_user = con.Execute(@$"
                        UPDATE `users`
                        SET
                        full_name = '{payload.last_name}, {payload.first_name}'
                        WHERE user_pk = (SELECT user_pk FROM `hosp_resident` WHERE res_pk = @res_pk LIMIT 1);
                        ", payload, transaction: tran);

                if (edit_user > 0)
                {
                    int edit_admin = con.Execute(@"
                        UPDATE hosp_resident
                        SET
                        user_pk=@user_pk,
                        doc_id=@doc_id,
                        pic_dest=@pic_dest,
                        spclty_pk=@spclty_pk,
                        prefix=@prefix,
                        first_name=@first_name,
                        middle_name=@middle_name,
                        last_name=@last_name,
                        suffix=@suffix,
                        gender=@gender,
                        bio=@bio,
                        email=@email,
                        mob_no=@mob_no,
                        is_active=@is_active
                        WHERE res_pk =@res_pk;
                        ", payload, transaction: tran);

                    if (edit_admin > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            message = $"The resident {payload.last_name}, {payload.first_name} has been updated successfully!"
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = $"There are no rows affected when trying to update the resident!"
                        };
                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"There are no rows affected when trying to update the administrator user account!"
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

        public ResponseModel ResetHospResidentPassword(HospResidentEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                int edit_user = con.Execute(@"
                        UPDATE `users`
                        SET
                        username=@emp_id,
                        pass = AES_ENCRYPT('cms',@emp_id)
                        WHERE user_pk = @user_pk;
                        ", payload, transaction: tran);

                if (edit_user > 0)
                {
                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        message = $"The administrator user crendentials has been reset!"
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"There are no rows affected when trying to reset the administrator user crendentials!"
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

        public ResponseModel GetTableHospResident(HospResidentTablePayload payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<HospResidentEntity> table_data = con.Query<HospResidentEntity>($@"
                                       SELECT * FROM (
                                        SELECT r.*, s.`spcldesc` AS specialty FROM `hosp_resident` r
                                        LEFT JOIN docspecialtymaster s ON r.`spclty_pk` = s.`spclcode`
                                        ) AS tmp_view
                                       WHERE
                                       COALESCE(specialty,'') LIKE CONCAT('%',@specialty,'%')
                                       AND COALESCE(first_name,'') LIKE CONCAT('%',@first_name,'%')
                                       AND COALESCE(last_name,'') LIKE CONCAT('%',@last_name,'%')
                                       {UseFilter.GenerateSearchEqualOrDefault("AND", "doc_id", "@doc_id")}
                                       AND is_active IN @is_active
                                       {UseFilter.GenWhereDateClause("encoded_at", ">=", payload.filters.date_from)} 
                                       {UseFilter.GenWhereDateClause("encoded_at", "<=", payload.filters.date_to)} 
                                       {UseFilter.GenTablePagination(payload.sort, payload.page)}",
                                       payload.filters, transaction: tran).ToList();

                bool has_more = table_data.Count > payload.page.limit;

                if (has_more)
                {
                    table_data.RemoveAt(table_data.Count - 1);
                }

                int count = has_more ? -1 : payload.page.begin * payload.page.limit + table_data.Count;

                foreach (var r in table_data)
                {
                    byte[] img_byte_arr = UseFtp.DownloadFtp(r.pic_dest, DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
                    if (img_byte_arr != null)
                    {
                        r.pic_dest = Convert.ToBase64String(img_byte_arr);
                    }
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

        public ResponseModel GetHospResidentByHospResidentPk(string res_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<HospResidentEntity> table_data = con.Query<HospResidentEntity>(
                    $@" SELECT * FROM hosp_resident where res_pk=@res_pk limit 1;",
                    new { res_pk }, transaction: tran).ToList();

                if (table_data.Count > 0)
                {
                    HospResidentEntity selected_admin = table_data[0];

                    byte[] img_byte_arr = UseFtp.DownloadFtp(selected_admin.pic_dest, DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
                    if (img_byte_arr != null)
                    {
                        selected_admin.pic_dest = Convert.ToBase64String(img_byte_arr);
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


        public ResponseModel GetHospResidentOptions(string dept_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<OptionModel> table_data = con.Query<OptionModel>($@"
                                      SELECT * FROM (
                                        SELECT res_pk id, TRIM(CONCAT(COALESCE(prefix,''),' ',last_name,' ',first_name,' ',COALESCE(suffix,''))) AS label FROM `hosp_resident`
                                        WHERE is_active = 'y' and res_pk NOT IN (select res_pk from dept_resident where dept_pk=@dept_pk)
                                        ) AS tmp ORDER BY label ASC
                            ", new { dept_pk }, transaction: tran).ToList();
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
