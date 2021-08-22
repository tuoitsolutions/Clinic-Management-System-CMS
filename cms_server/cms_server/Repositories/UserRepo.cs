using claim_form_server.Payloads;
using Dapper;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using pos_server.Entities;
using pos_server.Payloads;
using System;
using System.Collections.Generic;
using System.Linq;

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
                var user = con.QuerySingleOrDefault($@"SELECT * FROM users where user_pk = @user_pk limit 1;", new { user_pk }, transaction: tran);

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

        public List<string> HospResidentDepts(string user_pk)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            List<string> result = con.Query<string>($@"
                                       SELECT dr.`dept_pk` FROM `hosp_resident`  hr
                                    LEFT JOIN `dept_resident` dr  ON dr.`res_pk` = hr.`res_pk`
                                    WHERE hr.`user_pk` = @user_pk
                                    ",
                           new { user_pk }, transaction: tran).ToList();
            return result;
        }

    }
}
