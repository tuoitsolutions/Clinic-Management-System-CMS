using cms_server.Entities;
using Dapper;
using ddt_server.Config;
using ddt_server.Hooks;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Hooks;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using pos_server.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using static pos_server.Payloads.AdminPayloads;

namespace cms_server.Repositories
{
    public class AdminRepo
    {
        public ResponseModel InsertAdmin(AdminEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();


                UserEntity user = new UserEntity
                {
                    username = payload.emp_id,
                    full_name = $"{payload.last_name}, {payload.first_name}",
                    clinic_pk = "SA",
                    user_type = "admin",
                    is_active = "y",
                    encoder_pk = payload.encoder_pk
                };

                payload.user_pk = con.QuerySingle<int>(@$"
                        INSERT INTO users
                        SET
                        username=@username,
                        full_name=@full_name,
                        user_type=@user_type,
                        clinic_pk=@clinic_pk,
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
                        file_upload_response = UseFtp.UploadToFtp(payload.img_attach, DefaultConfig.ftp_ip, $"/{DefaultConfig.app_name}/Uploads/UserPhotos/", DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
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
                        INSERT INTO administrator
                        SET
                        user_pk=@user_pk,
                        emp_id=@emp_id,
                        pic_dest=@pic_dest,
                        first_name=@first_name,
                        middle_name=@middle_name,
                        last_name=@last_name,
                        suffix=@suffix,
                        gender=@gender,
                        position=@position,
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

        public ResponseModel UpdateAdmin(AdminEntity payload)
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
                    file_upload_response = UseFtp.UploadToFtp(payload.img_attach, DefaultConfig.ftp_ip, $"/{DefaultConfig.app_name}/Uploads/UserPhotos/", DefaultConfig.ftp_user, DefaultConfig.ftp_pass);

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
                        WHERE user_pk = (SELECT user_pk FROM `administrator` WHERE admin_pk = @admin_pk LIMIT 1);
                        ", payload, transaction: tran);

                if (edit_user > 0)
                {
                    int edit_admin = con.Execute(@"
                        UPDATE administrator
                        SET
                        pic_dest=@pic_dest,
                        emp_id=@emp_id,
                        first_name=@first_name,
                        middle_name=@middle_name,
                        last_name=@last_name,
                        suffix=@suffix,
                        gender=@gender,
                        position=@position,
                        email=@email,
                        mob_no=@mob_no,
                        is_active=@is_active
                        WHERE admin_pk =@admin_pk;
                        ", payload, transaction: tran);

                    if (edit_admin > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            message = $"The administrator {payload.last_name}, {payload.first_name} has been updated successfully!"
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = $"There are no rows affected when trying to update the administrator!"
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

        public ResponseModel ResetAdminPassword(AdminEntity payload)
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

        public ResponseModel GetTableAdmin(AdminTablePayload payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<AdminEntity> table_data = con.Query<AdminEntity>($@"
                                       SELECT * FROM `administrator`
                                       WHERE
                                       COALESCE(first_name,'') LIKE CONCAT('%',@first_name,'%')
                                       {UseFilter.GenerateSearchEqualOrDefault("AND", "emp_id", "@emp_id")}
                                       AND COALESCE(last_name,'') LIKE CONCAT('%',@last_name,'%')
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

        public ResponseModel GetAdminByAdminPk(string admin_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<AdminEntity> table_data = con.Query<AdminEntity>(
                    $@" SELECT * FROM administrator where admin_pk=@admin_pk limit 1;",
                    new { admin_pk }, transaction: tran).ToList();

                if (table_data.Count > 0)
                {
                    AdminEntity selected_admin = table_data[0];

                    byte[] img_byte_arr = UseFtp.DownloadFtp(DefaultConfig.ftp_ip + selected_admin.pic_dest, DefaultConfig.ftp_user, DefaultConfig.ftp_pass);

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


        public ResponseModel PreviewAdminPic(string admin_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<AdminEntity> table_data = con.Query<AdminEntity>(
                    $@" SELECT pic_dest FROM administrator where admin_pk=@admin_pk limit 1;",
                    new { admin_pk }, transaction: tran).ToList();

                if (table_data.Count > 0)
                {
                    AdminEntity selected_admin = table_data[0];

                    byte[] img_byte_arr = UseFtp.DownloadFtp(DefaultConfig.ftp_ip + selected_admin.pic_dest, DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
                    if (img_byte_arr != null)
                    {
                        selected_admin.pic_dest = "data:image/png;base64," + Convert.ToBase64String(img_byte_arr);
                    }
                    else
                    {
                        selected_admin.pic_dest = null;
                    }

                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        data = selected_admin.pic_dest
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
