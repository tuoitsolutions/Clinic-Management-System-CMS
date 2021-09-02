using cms_server.Entities;
using Dapper;
using ddt_server.Config;
using ddt_server.Hooks;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Hooks;
using DeliveryRoomWatcher.Models.Common;
using DeliveryRoomWatcher.Repositories;
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
        UserRepo user_repo = new UserRepo();
        public ResponseModel InsertHospResident(HospResidentEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();


                UserEntity user = new UserEntity
                {
                    username = payload.license_no,
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


                    UserEntity user_info = con.QuerySingle<UserEntity>(
                                            $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                                            , new { user_pk = payload.encoder_pk }
                                            , transaction: tran);
                    int add_admin = 0;
                    if (user_info.user_type.Equals("admin"))
                    {
                        add_admin = con.Execute(@"
                        INSERT INTO hosp_resident
                        SET
                        user_pk=@user_pk,
                        license_no=@license_no,
                        pic_dest=@pic_dest,
                        dept_pk=@dept_pk,
                        spclty_pk=@spclty_pk,
                        first_name=@first_name,
                        middle_name=@middle_name,
                        last_name=@last_name,
                        suffix=@suffix,
                        doc_title=@doc_title,
                        gender=@gender,
                        bio=@bio,
                        email=@email,
                        mob_no=@mob_no,
                        is_active=@is_active,
                        encoded_at=NOW(),
                        encoder_pk=@encoder_pk;
                        ", payload, transaction: tran);
                    }
                    else if (user_info.user_type.Equals("hosp_resident"))
                    {
                        payload.dept_pk = con.QuerySingle<int>($"SELECT `dept_pk` FROM `hosp_resident` WHERE res_pk = `get_user_res_pk`('{user_info.user_pk}') ;"
                            , null, transaction: tran);

                        add_admin = con.Execute($@"
                        INSERT INTO hosp_resident
                        SET
                        user_pk=@user_pk,
                        license_no=@license_no,
                        pic_dest=@pic_dest,
                        dept_pk=@dept_pk,
                        spclty_pk=@spclty_pk,
                        first_name=@first_name,
                        middle_name=@middle_name,
                        last_name=@last_name,
                        suffix=@suffix,
                        doc_title=@doc_title,
                        gender=@gender,
                        bio=@bio,
                        email=@email,
                        mob_no=@mob_no,
                        is_active=@is_active,
                        encoded_at=NOW(),
                        encoder_pk=@encoder_pk;
                        ", payload, transaction: tran);
                    }


                    if (add_admin > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            message = $"The hospital resident {payload.last_name}, {payload.first_name} has been added successfully!"
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = $"There are no rows affected when trying to add the new hospital resident!"
                        };
                    }
                }
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"There are no rows affected when trying to create a user for the new hospital resident!"
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
                        WHERE user_pk = (SELECT user_pk FROM `hosp_resident` WHERE res_pk = @res_pk LIMIT 1);
                        ", payload, transaction: tran);

                UserEntity user_info = con.QuerySingle<UserEntity>(
                                          $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                                          , new { user_pk = payload.encoder_pk }
                                          , transaction: tran);
                int edit_admin = 0;


                if (edit_user > 0)
                {
                    if (user_info.user_type.Equals("admin"))
                    {
                        edit_admin = con.Execute(@"
                        UPDATE hosp_resident
                        SET
                        license_no=@license_no,
                        pic_dest=@pic_dest,
                        spclty_pk=@spclty_pk,
                        dept_pk=@dept_pk,
                        first_name=@first_name,
                        middle_name=@middle_name,
                        last_name=@last_name,
                        doc_title=@doc_title,
                        suffix=@suffix,
                        gender=@gender,
                        bio=@bio,
                        email=@email,
                        mob_no=@mob_no,
                        is_active=@is_active
                        WHERE res_pk =@res_pk;
                        ", payload, transaction: tran);
                    }
                    else if (user_info.user_type.Equals("hosp_resident"))
                    {
                        payload.dept_pk = con.QuerySingle<int>($"SELECT `dept_pk` FROM `hosp_resident` WHERE res_pk = `get_user_res_pk`('{user_info.user_pk}') ;"
                            , null, transaction: tran);

                        edit_admin = con.Execute($@"
                        UPDATE hosp_resident
                        SET
                        license_no=@license_no,
                        pic_dest=@pic_dest,
                        spclty_pk=@spclty_pk,
                        first_name=@first_name,
                        middle_name=@middle_name,
                        last_name=@last_name,
                        doc_title=@doc_title,
                        suffix=@suffix,
                        gender=@gender,
                        bio=@bio,
                        email=@email,
                        mob_no=@mob_no,
                        is_active=@is_active
                        WHERE res_pk =@res_pk;
                        ", payload, transaction: tran);
                    }


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
                        message = $"There are no rows affected when trying to update the hospital resident user account!"
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
                        message = $"The hospital resident user crendentials has been reset!"
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"There are no rows affected when trying to reset the hospital resident user crendentials!"
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

        public ResponseModel GetTableHospResident(HospResidentTablePayload payload, string user_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                UserEntity user_info = con.QuerySingle<UserEntity>(
                 $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                 , new { user_pk }
                 , transaction: tran);

                List<HospResidentEntity> table_data = null;

                if (user_info.user_type.Equals("hosp_resident"))
                {

                    table_data = con.Query<HospResidentEntity>($@"
                                       SELECT * FROM (
                                        SELECT r.*
                                        ,CONCAT(r.`first_name`,`concat_nullable_string`(r.`middle_name`,' '),' ',r.`last_name`,`concat_nullable_string`(r.`suffix`,' '),`concat_nullable_string`(r.`doc_title`,', ')) res_name
                                        ,s.`spcldesc` AS specialty 
                                        ,d.`dept_name` AS dept_name 
                                        FROM `hosp_resident` r
                                        LEFT JOIN docspecialtymaster s ON r.`spclty_pk` = s.`spclcode`
                                        LEFT JOIN department d ON d.`dept_pk` = r.`dept_pk`
                                        WHERE r.`dept_pk` = (SELECT `dept_pk` FROM `hosp_resident` WHERE  res_pk = `get_user_res_pk`('{user_pk}'))
                                        ) AS tmp_view
                                       WHERE
                                       COALESCE(specialty,'') LIKE CONCAT('%',@specialty,'%')
                                       AND COALESCE(first_name,'') LIKE CONCAT('%',@first_name,'%')
                                       AND COALESCE(last_name,'') LIKE CONCAT('%',@last_name,'%')
                                       {UseFilter.GenerateSearchEqualOrDefault("AND", "license_no", "@license_no")}
                                       AND is_active IN @is_active
                                       {UseFilter.GenWhereDateClause("encoded_at", ">=", payload.filters.date_from)} 
                                       {UseFilter.GenWhereDateClause("encoded_at", "<=", payload.filters.date_to)} 
                                       {UseFilter.GenTablePagination(payload.sort, payload.page)}",
                                       payload.filters, transaction: tran).ToList();
                }
                else if (user_info.user_type.Equals("admin"))
                {
                    table_data = con.Query<HospResidentEntity>($@"
                                        SELECT * FROM (
                                        SELECT r.*
                                        ,CONCAT(r.`first_name`,`concat_nullable_string`(r.`middle_name`,' '),' ',r.`last_name`,`concat_nullable_string`(r.`suffix`,' '),`concat_nullable_string`(r.`doc_title`,', ')) res_name
                                        ,s.`spcldesc` AS specialty 
                                        ,d.`dept_name` AS dept_name 
                                        FROM `hosp_resident` r
                                        LEFT JOIN docspecialtymaster s ON r.`spclty_pk` = s.`spclcode`
                                        LEFT JOIN department d ON d.`dept_pk` = r.`dept_pk`
                                        ) AS tmp_view
                                       WHERE
                                       COALESCE(specialty,'') LIKE CONCAT('%',@specialty,'%')
                                       AND COALESCE(first_name,'') LIKE CONCAT('%',@first_name,'%')
                                       AND COALESCE(last_name,'') LIKE CONCAT('%',@last_name,'%')
                                       {UseFilter.GenerateSearchEqualOrDefault("AND", "license_no", "@license_no")}
                                       AND is_active IN @is_active
                                       {UseFilter.GenWhereDateClause("encoded_at", ">=", payload.filters.date_from)} 
                                       {UseFilter.GenWhereDateClause("encoded_at", "<=", payload.filters.date_to)} 
                                       {UseFilter.GenTablePagination(payload.sort, payload.page)}",
                                       payload.filters, transaction: tran).ToList();
                }



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


        public ResponseModel PreviewResidentPic(string res_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<HospResidentEntity> table_data = con.Query<HospResidentEntity>(
                    $@" SELECT pic_dest FROM hosp_resident where res_pk=@res_pk limit 1;",
                    new { res_pk }, transaction: tran).ToList();

                if (table_data.Count > 0)
                {
                    HospResidentEntity selected_admin = table_data[0];

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


        public ResponseModel GetHospResidentOptions(string dept_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<OptionModel> table_data = con.Query<OptionModel>($@"
                                     SELECT * FROM (
                                        SELECT r.res_pk id
                                        ,CONCAT(r.`first_name`,`concat_nullable_string`(r.`middle_name`,' '),' ',r.`last_name`,`concat_nullable_string`(r.`suffix`,' '),`concat_nullable_string`(r.`doc_title`,', ')) label
                                        FROM `hosp_resident` r
                                        WHERE r.is_active = 'y'  AND r.dept_pk =@dept_pk
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

        public ResponseModel GetHospResidentOptionsByUserDept(string user_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                UserEntity user_info = con.QuerySingle<UserEntity>(
               $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
               , new { user_pk }
               , transaction: tran);

                if (user_info.user_type.Equals("hosp_resident"))
                {
                    string dept_pk = user_repo.GetHospResidentDept(user_pk);

                    List<OptionModel> table_data = con.Query<OptionModel>($@"
                                      SELECT * FROM (
                                        SELECT r.res_pk id
                                        ,CONCAT(r.`first_name`,`concat_nullable_string`(r.`middle_name`,' '),' ',r.`last_name`,`concat_nullable_string`(r.`suffix`,' '),`concat_nullable_string`(r.`doc_title`,', ')) label
                                        FROM `hosp_resident` r
                                        WHERE r.is_active = 'y'  AND r.dept_pk =@dept_pk
                                        ) AS tmp ORDER BY label ASC
                            ", new { dept_pk }, transaction: tran).ToList();
                    return new ResponseModel
                    {
                        success = true,
                        data = table_data
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "You are restricted from accessing this resource!"
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


        public ResponseModel UpdateResidentESign(HospResidentEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                UserEntity user_info = con.QuerySingle<UserEntity>(
                                         $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                                         , new { user_pk = payload.encoder_pk }
                                         , transaction: tran);


                payload.res_pk = con.QuerySingle<int>($@"SELECT res_pk  FROM hosp_resident where user_pk = @user_pk LIMIT 1;"
                                          , new { user_info.user_pk }
                                          , transaction: tran);

                FileResponseModel file_upload_response = new FileResponseModel
                {
                    success = true
                };

                if (payload.esignature_attach != null)
                {
                    file_upload_response = UseFtp.UploadToFtp(payload.esignature_attach, DefaultConfig.ftp_ip, $"/{DefaultConfig.app_name}/Uploads/Signatures/", DefaultConfig.ftp_user, DefaultConfig.ftp_pass);

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
                        payload.esignature_dest = file_upload_response.data.path;
                    }
                }



                if (user_info.user_type.Equals("hosp_resident"))
                {
                    int edit_admin = con.Execute($@"
                        UPDATE hosp_resident
                        SET
                        esignature_dest=@esignature_dest
                        WHERE res_pk =@res_pk;
                        ", payload, transaction: tran);

                    if (edit_admin > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            message = $"Your electronic signature has been updated successfully."
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = $"There are no rows affected when trying to update the data!"
                        };
                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "You are restricted from accessing this information!"
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

        public ResponseModel PreviewResidentESign(HospResidentEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                HospResidentEntity selected_admin = null;
                if (payload.res_pk == null)
                {
                    selected_admin = con.QuerySingle<HospResidentEntity>(
                  $@" SELECT esignature_dest FROM hosp_resident where user_pk=@user_pk limit 1;",
                  new { user_pk = payload.encoder_pk }, transaction: tran);
                }
                else
                {
                    selected_admin = con.QuerySingle<HospResidentEntity>(
                  $@" SELECT esignature_dest FROM hosp_resident where res_pk=@res_pk limit 1;",
                  new { payload.res_pk }, transaction: tran);
                }


                byte[] img_byte_arr = UseFtp.DownloadFtp(DefaultConfig.ftp_ip + selected_admin.esignature_dest, DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
                if (img_byte_arr != null)
                {
                    selected_admin.esignature_dest = "data:image/png;base64," + Convert.ToBase64String(img_byte_arr);
                }
                else
                {
                    selected_admin.esignature_dest = null;
                }

                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = selected_admin.esignature_dest
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
