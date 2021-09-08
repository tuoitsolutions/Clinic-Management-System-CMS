using claim_form_server.Payloads;
using cms_server.Entities;
using Dapper;
using ddt_server.Config;
using ddt_server.Hooks;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using pos_server.Entities;
using pos_server.Payloads;
using System;
using System.Collections.Generic;
using System.Linq;
using static cms_server.Config.UserConfig;

namespace DeliveryRoomWatcher.Repositories
{
    public class UserRepo
    {
        public UserResponseModel AuthenticateUser(AuthUserPayload payload)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                var user_data = con.Query<UserEntity>(
                    $@"SELECT user_pk,user_type  FROM `users` 
                    WHERE
                    AES_ENCRYPT(@password,@username)=pass
                    LIMIT 1",
                    payload, transaction: tran).ToList();

                if (user_data.Count() > 0)
                {
                    tran.Commit();
                    return new UserResponseModel
                    {
                        success = true,
                        data = user_data,
                        message = "You are logged in successfully!"
                    };
                }
                else
                {
                    return new UserResponseModel
                    {
                        success = false,
                        message = "Your username and/or password is not correct! Please try again."
                    };
                }
            }
            catch (Exception e)
            {
                return new UserResponseModel
                {
                    success = false,
                    message = "Server error has occured! " + e.Message.ToString()
                };
            }
        }
        public int IsAllowLogin(string physicaladdress, string username)
        {
            int allow = 0;
            using (var con = new MySqlConnection(DatabaseConfig.GetConnection()))
            {
                con.Open();
                using var tran = con.BeginTransaction();
                allow = con.QuerySingleOrDefault<int>($@"SELECT 
                                            IF(COUNT(cl.stationno) < 1 , 1 , 
                                            IF(cl.cashout IS NOT NULL AND cl.timeout IS NOT NULL, 1,IF(cl.`user` = @username , 1 , 0))
                                            ) AS 'is_allow'
                                            FROM cashierlog cl
                                            JOIN `cashiermaster` cs 
                                            ON cl.`stationno` = cs.`cashierno`
                                            WHERE cs.`physicaladdress` = @physicaladdress ",
                                    new { username = username, physicaladdress = physicaladdress }, transaction: tran);
            }
            return allow;
        }

        public ResponseModel GetLoggedUser(string user_pk)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                var user = con.QuerySingleOrDefault<UserEntity>($@"SELECT full_name,user_type,sts_pk,log_count FROM users where user_pk = @user_pk limit 1;", new { user_pk }, transaction: tran);


                if (IsUserRole(USER_ROLES.ADMIN, user.user_type))
                {
                    user.user_sub = "Administrator";
                }
                else if (IsUserRole(USER_ROLES.HOSP_RESIDENT, user.user_type))
                {
                    string resident_dept = con.QuerySingleOrDefault<string>(
                        $@"SELECT d.`dept_name` FROM `hosp_resident` hr
                            LEFT JOIN `department` d ON hr.`dept_pk` = d.`dept_pk`
                            WHERE hr.`user_pk` = @user_pk LIMIT 1;"
                        , new { user_pk }, transaction: tran);

                    user.user_sub = $"{resident_dept} Resident";

                }

                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = user
                };
            }
            catch (Exception e)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "Failed. " + e.Message.ToString()
                };
            }
        }

        public string GetHospResidentDept(string user_pk)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            string result = con.QuerySingle<string>($"SELECT `dept_pk` FROM `hosp_resident` WHERE res_pk = `get_user_res_pk`('{user_pk}') ;"
                          , null, transaction: tran);
            return result;
        }

        public ResponseModel GetUserResidentDtls(string user_pk)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                UserEntity user_info = con.QuerySingle<UserEntity>(
                $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                , new { user_pk }
                , transaction: tran);

                if (user_info.user_type.Equals("hosp_resident"))
                {
                    List<HospResidentEntity> table_data = null;
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
                                       WHERE user_pk=@user_pk LIMIT 1;"
                                       , new { user_pk }
                                       , transaction: tran).ToList();

                    if (table_data.Count > 0)
                    {
                        HospResidentEntity resident = table_data[0];
                        return new ResponseModel
                        {
                            success = true,
                            data = resident
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "We are not able to find your hospital resident information."
                        };
                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "You are not allowed to access this information."
                    };
                }
            }
            catch (Exception e)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Details: " + e.Message.ToString()
                };
            }
        }

        public ResponseModel GetUserResidentPic(string user_pk)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                UserEntity user_info = con.QuerySingle<UserEntity>(
                $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                , new { user_pk }
                , transaction: tran);

                if (user_info.user_type.Equals("hosp_resident"))
                {
                    List<HospResidentEntity> table_data = null;
                    table_data = con.Query<HospResidentEntity>($@"
                                       SELECT pic_dest FROM `hosp_resident`  WHERE user_pk=@user_pk LIMIT 1;"
                                       , new { user_pk }
                                       , transaction: tran).ToList();

                    if (table_data.Count > 0)
                    {
                        HospResidentEntity resident = table_data[0];

                        byte[] img_byte_arr = UseFtp.DownloadFtp(DefaultConfig.ftp_ip + resident.pic_dest, DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
                        if (img_byte_arr != null)
                        {
                            resident.pic_dest = "data:image/png;base64," + Convert.ToBase64String(img_byte_arr);
                        }
                        else
                        {
                            resident.pic_dest = null;
                        }

                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            data = resident.pic_dest
                        };

                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = "We are not able to find the requested data."
                        };
                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "You are not allowed to access the requested data."
                    };
                }
            }
            catch (Exception e)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Details: " + e.Message.ToString()
                };
            }
        }


        public ResponseModel GetUserPhoto(string user_pk)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                UserEntity user_info = con.QuerySingle<UserEntity>(
                $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                , new { user_pk }
                , transaction: tran);

                string pic_dest = "";

                if (IsUserRole(USER_ROLES.ADMIN, user_info.user_type))
                {
                    pic_dest = con.QuerySingleOrDefault<string>(
                        $@"SELECT pic_dest FROM `administrator` WHERE user_pk  = @user_pk  LIMIT 1;"
                        , new { user_pk }, transaction: tran);
                }
                else if (IsUserRole(USER_ROLES.HOSP_RESIDENT, user_info.user_type))
                {
                    pic_dest = con.QuerySingleOrDefault<string>(
                        $@"SELECT pic_dest FROM `hosp_resident` WHERE user_pk  = @user_pk  LIMIT 1;"
                        , new { user_pk }, transaction: tran);
                }

                string img_file = "";

                if (!String.IsNullOrEmpty(pic_dest))
                {
                    byte[] img_byte_arr = UseFtp.DownloadFtp(DefaultConfig.ftp_ip + pic_dest, DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
                    if (img_byte_arr != null)
                    {
                        img_file = "data:image/png;base64," + Convert.ToBase64String(img_byte_arr);
                    }
                    else
                    {
                        img_file = null;
                    }

                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        data = img_file
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = "We could not retrieve the user's photo!"
                    };
                }
            }
            catch (Exception e)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Details: " + e.Message.ToString()
                };
            }
        }


        public ResponseModel GetResidentPicByUserPk(string res_user_pk)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                HospResidentEntity resident = con.QuerySingle<HospResidentEntity>($@"
                                       SELECT pic_dest FROM `hosp_resident`  WHERE user_pk=@res_user_pk LIMIT 1;"
                                   , new { res_user_pk }
                                   , transaction: tran);

                byte[] img_byte_arr = UseFtp.DownloadFtp(DefaultConfig.ftp_ip + resident.pic_dest, DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
                if (img_byte_arr != null)
                {
                    resident.pic_dest = "data:image/png;base64," + Convert.ToBase64String(img_byte_arr);
                }
                else
                {
                    resident.pic_dest = null;
                }

                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = resident.pic_dest
                };
            }
            catch (Exception e)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "The process has been terminated. Error Details: " + e.Message.ToString()
                };
            }
        }


        //update pic
        //update info
        //change password

    }
}
