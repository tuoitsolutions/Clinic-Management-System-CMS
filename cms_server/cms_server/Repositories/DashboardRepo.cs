using cms_server.Entities;
using Dapper;
using ddt_server.Config;
using ddt_server.Hooks;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Models.Common;
using DeliveryRoomWatcher.Repositories;
using MySql.Data.MySqlClient;
using pos_server.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using static cms_server.Config.UserConfig;
using static cms_server.Models.DashboardModel;

namespace cms_server.Repositories
{
    public class DashboardRepo
    {
        UserRepo user_repo = new UserRepo();
        public ResponseModel GetTotalForApproval(string user_pk)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                string total = "";

                UserEntity user_info = con.QuerySingle<UserEntity>(
                 $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                 , new { user_pk }
                 , transaction: tran);

                if (IsUserRole(USER_ROLES.ADMIN, user_info.user_type))
                {
                    total = con.QuerySingle<string>(
                        $@"SELECT COUNT(consult_req_pk) AS total FROM `consult_request` WHERE sts_pk = 'fa'"
                           , null, transaction: tran);
                }
                else if (IsUserRole(USER_ROLES.HOSP_RESIDENT, user_info.user_type))
                {
                    string res_dept_pk = user_repo.GetHospResidentDept(user_pk);
                    total = con.QuerySingle<string>(
                      $@"SELECT COUNT(consult_req_pk) AS total FROM `consult_request`
                         WHERE sts_pk = 'fa' AND assign_dept_pk = @res_dept_pk;"
                         , new { res_dept_pk }, transaction: tran);
                }

                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = total
                };
            }
            catch (Exception e)
            {
                tran.Rollback();
                return new ResponseModel
                {
                    success = false,
                    message = $"The server has encountered a problem. {e.Message}",
                };
            }
        }

        public ResponseModel GetTotalPaid(string user_pk)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                string total = "";

                UserEntity user_info = con.QuerySingle<UserEntity>(
                 $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                 , new { user_pk }
                 , transaction: tran);

                if (IsUserRole(USER_ROLES.ADMIN, user_info.user_type))
                {
                    total = con.QuerySingle<string>(
                        $@"SELECT COUNT(consult_req_pk) AS total FROM `consult_request` WHERE sts_pk = 'pd'"
                           , null, transaction: tran);
                }
                else if (IsUserRole(USER_ROLES.HOSP_RESIDENT, user_info.user_type))
                {
                    string res_dept_pk = user_repo.GetHospResidentDept(user_pk);
                    total = con.QuerySingle<string>(
                      $@"SELECT COUNT(consult_req_pk) AS total FROM `consult_request`
                         WHERE sts_pk = 'pd' AND assign_dept_pk = @res_dept_pk;"
                         , new { res_dept_pk }, transaction: tran);
                }

                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = total
                };
            }
            catch (Exception e)
            {
                tran.Rollback();
                return new ResponseModel
                {
                    success = false,
                    message = $"The server has encountered a problem. {e.Message}",
                };
            }
        }

        public ResponseModel GetTotalStarted(string user_pk)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                string total = "";

                UserEntity user_info = con.QuerySingle<UserEntity>(
                 $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                 , new { user_pk }
                 , transaction: tran);

                if (IsUserRole(USER_ROLES.ADMIN, user_info.user_type))
                {
                    total = con.QuerySingle<string>(
                        $@"SELECT COUNT(consult_req_pk) AS total FROM `consult_request` WHERE sts_pk = 's'"
                           , null, transaction: tran);
                }
                else if (IsUserRole(USER_ROLES.HOSP_RESIDENT, user_info.user_type))
                {
                    string res_dept_pk = user_repo.GetHospResidentDept(user_pk);
                    total = con.QuerySingle<string>(
                      $@"SELECT COUNT(consult_req_pk) AS total FROM `consult_request`
                         WHERE sts_pk = 's' AND assign_dept_pk = @res_dept_pk;"
                         , new { res_dept_pk }, transaction: tran);
                }

                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = total
                };
            }
            catch (Exception e)
            {
                tran.Rollback();
                return new ResponseModel
                {
                    success = false,
                    message = $"The server has encountered a problem. {e.Message}",
                };
            }
        }

        public ResponseModel GetTotalEnded(string user_pk)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                string total = "";

                UserEntity user_info = con.QuerySingle<UserEntity>(
                 $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                 , new { user_pk }
                 , transaction: tran);

                if (IsUserRole(USER_ROLES.ADMIN, user_info.user_type))
                {
                    total = con.QuerySingle<string>(
                        $@"SELECT COUNT(consult_req_pk) AS total FROM `consult_request` WHERE sts_pk = 'e'"
                           , null, transaction: tran);
                }
                else if (IsUserRole(USER_ROLES.HOSP_RESIDENT, user_info.user_type))
                {
                    string res_dept_pk = user_repo.GetHospResidentDept(user_pk);
                    total = con.QuerySingle<string>(
                      $@"SELECT COUNT(consult_req_pk) AS total FROM `consult_request`
                         WHERE sts_pk = 'e' AND assign_dept_pk = @res_dept_pk;"
                         , new { res_dept_pk }, transaction: tran);
                }

                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = total
                };
            }
            catch (Exception e)
            {
                tran.Rollback();
                return new ResponseModel
                {
                    success = false,
                    message = $"The server has encountered a problem. {e.Message}",
                };
            }
        }

        public ResponseModel GetFinishConsult(string user_pk)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {

                List<LineDashboardModel> total_chart = new List<LineDashboardModel>();

                UserEntity user_info = con.QuerySingle<UserEntity>(
                 $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                 , new { user_pk }
                 , transaction: tran);

                for (int i = 0; i < 15; i++)
                {
                    string dt = (DateTime.Now.AddDays(i * -1)).ToString("yyyy-MM-dd");

                    string chart_item = null;

                    if (IsUserRole(USER_ROLES.ADMIN, user_info.user_type))
                    {
                        chart_item = con.QuerySingle<string>(
                            $@"SELECT  COUNT(`consult_req_pk`) AS 'y' FROM `consult_request` 
                               WHERE sts_pk = 'e' AND DATE(request_at) = '{dt}'"
                               , null, transaction: tran);
                    }
                    else if (IsUserRole(USER_ROLES.HOSP_RESIDENT, user_info.user_type))
                    {
                        string res_dept_pk = user_repo.GetHospResidentDept(user_pk);
                        chart_item = con.QuerySingle<string>(
                          $@"SELECT  COUNT(`consult_req_pk`) AS 'y' FROM `consult_request` 
                               WHERE sts_pk = 'e' AND DATE(request_at) = '{dt}' AND assign_dept_pk = @res_dept_pk; "
                             , new { res_dept_pk }, transaction: tran);
                    }

                    string dt_display = (DateTime.Now.AddDays(i * -1)).ToString("MMM. dd");

                    total_chart.Add(new LineDashboardModel
                    {
                        x = dt_display,
                        y = (chart_item ?? "0")
                    });
                }

                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = total_chart
                };
            }
            catch (Exception e)
            {
                tran.Rollback();
                return new ResponseModel
                {
                    success = false,
                    message = $"The server has encountered a problem. {e.Message}",
                };
            }
        }

        public ResponseModel GetLatestConsultReqUserDept(string user_pk)
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

                List<ConsultRequestEntity> data_table = new List<ConsultRequestEntity>() { };

                if (IsUserRole(USER_ROLES.HOSP_RESIDENT, user_info.user_type))
                {
                    string res_dept_pk = user_repo.GetHospResidentDept(user_pk);
                    data_table = con.Query<ConsultRequestEntity>($@"
                                   SELECT  *
                                   ,MD5(consult_req_pk) hash_key
                                   ,CONCAT(`concat_nullable_string_end`(`prefix`,' '),`first_name`,`concat_nullable_string`(`middle_name`,' '),' ',`last_name`,`concat_nullable_string`(`suffix`,' ')) pat_name 
                                   FROM `consult_request`
                                   WHERE sts_pk IN ('fa','pd') AND assign_dept_pk = @res_dept_pk  ORDER BY `request_at` DESC LIMIT 10;"
                                    , new { res_dept_pk }, transaction: tran).ToList();

                    foreach (var row in data_table)
                    {
                        row.status = con.QuerySingleOrDefault<StatusMasterEntity>(
                            "select * from status_master where sts_pk=@sts_pk"
                            , new { row.sts_pk }
                            , transaction: tran);

                        row.assigned_resident_info = con.QuerySingleOrDefault<HospResidentEntity>(
                            $@" SELECT r.*
                            ,CONCAT(r.`first_name`,`concat_nullable_string`(r.`middle_name`,' '),' ',r.`last_name`,`concat_nullable_string`(r.`suffix`,' '),`concat_nullable_string`(r.`doc_title`,', ')) res_name
                            ,s.`spcldesc` AS specialty 
                            ,d.`dept_name` AS dept_name 
                            FROM `hosp_resident` r
                            LEFT JOIN docspecialtymaster s ON r.`spclty_pk` = s.`spclcode`
                            LEFT JOIN department d ON d.`dept_pk` = r.`dept_pk` 
                            WHERE res_pk = @res_pk LIMIT 1;"
                            , new { res_pk = row.assign_res_pk }
                            , transaction: tran);
                    }

                }

                return new ResponseModel
                {
                    success = true,
                    data = data_table
                };
            }
            catch (Exception e)
            {
                tran.Rollback();
                return new ResponseModel
                {
                    success = false,
                    message = $"The server has encountered a problem. {e.Message}",
                };
            }
        }

        public ResponseModel GetLatestConsultReqOtherDept(string user_pk)
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

                List<ConsultRequestEntity> data_table = new List<ConsultRequestEntity>() { };

                if (IsUserRole(USER_ROLES.HOSP_RESIDENT, user_info.user_type))
                {
                    string res_dept_pk = user_repo.GetHospResidentDept(user_pk);
                    data_table = con.Query<ConsultRequestEntity>($@"
                                   SELECT  *
                                   ,MD5(consult_req_pk) hash_key
                                   ,CONCAT(`concat_nullable_string_end`(`prefix`,' '),`first_name`,`concat_nullable_string`(`middle_name`,' '),' ',`last_name`,`concat_nullable_string`(`suffix`,' ')) pat_name 
                                   FROM `consult_request`
                                   WHERE sts_pk IN ('fa','pd') AND assign_dept_pk <> @res_dept_pk  ORDER BY `request_at` DESC LIMIT 10;"
                                    , new { res_dept_pk }, transaction: tran).ToList();
                }
                else if (IsUserRole(USER_ROLES.ADMIN, user_info.user_type))
                {
                    data_table = con.Query<ConsultRequestEntity>($@"
                                   SELECT  *
                                   ,MD5(consult_req_pk) hash_key
                                   ,CONCAT(`concat_nullable_string_end`(`prefix`,' '),`first_name`,`concat_nullable_string`(`middle_name`,' '),' ',`last_name`,`concat_nullable_string`(`suffix`,' ')) pat_name 
                                   FROM `consult_request`
                                   WHERE sts_pk IN ('fa','pd') ORDER BY `request_at` DESC LIMIT 10;"
                                   , null, transaction: tran).ToList();
                }

                foreach (var row in data_table)
                {
                    row.status = con.QuerySingleOrDefault<StatusMasterEntity>(
                        "select * from status_master where sts_pk=@sts_pk"
                        , new { row.sts_pk }
                        , transaction: tran);

                    row.assigned_resident_info = con.QuerySingleOrDefault<HospResidentEntity>(
                        $@" SELECT r.*
                            ,CONCAT(r.`first_name`,`concat_nullable_string`(r.`middle_name`,' '),' ',r.`last_name`,`concat_nullable_string`(r.`suffix`,' '),`concat_nullable_string`(r.`doc_title`,', ')) res_name
                            ,s.`spcldesc` AS specialty 
                            ,d.`dept_name` AS dept_name 
                            FROM `hosp_resident` r
                            LEFT JOIN docspecialtymaster s ON r.`spclty_pk` = s.`spclcode`
                            LEFT JOIN department d ON d.`dept_pk` = r.`dept_pk` 
                            WHERE res_pk = @res_pk LIMIT 1;"
                        , new { res_pk = row.assign_res_pk }
                        , transaction: tran);
                }

                return new ResponseModel
                {
                    success = true,
                    data = data_table
                };
            }
            catch (Exception e)
            {
                tran.Rollback();
                return new ResponseModel
                {
                    success = false,
                    message = $"The server has encountered a problem. {e.Message}",
                };
            }
        }

        public ResponseModel GetCharity(string user_pk)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {

                List<LineDashboardModel> total_charity = new List<LineDashboardModel>();
                List<LineDashboardModel> total_non_charity = new List<LineDashboardModel>();

                UserEntity user_info = con.QuerySingle<UserEntity>(
                 $@"SELECT full_name,user_type,username,user_pk FROM `users` WHERE user_pk=@user_pk;"
                 , new { user_pk }
                 , transaction: tran);

                for (int i = 0; i < 15; i++)
                {
                    string dt = (DateTime.Now.AddDays(i * -1)).ToString("yyyy-MM-dd");

                    string is_non_charity = "";

                    string is_charity = "";

                    if (IsUserRole(USER_ROLES.ADMIN, user_info.user_type))
                    {
                        is_charity = con.QuerySingle<string>(
                         $@"SELECT  COUNT(`consult_req_pk`) AS 'y' FROM `consult_request` 
                            WHERE sts_pk  IN ('s','e') AND is_charity = 'y' AND DATE(request_at) = '{dt}'; "
                         , null, transaction: tran);


                        is_non_charity = con.QuerySingle<string>(
                        $@"SELECT  COUNT(`consult_req_pk`) AS 'y' FROM `consult_request` 
                          WHERE sts_pk  IN ('s','e') AND is_charity = 'n' AND DATE(request_at) = '{dt}'; "
                        , null, transaction: tran);
                    }
                    else if (IsUserRole(USER_ROLES.HOSP_RESIDENT, user_info.user_type))
                    {
                        string res_dept_pk = user_repo.GetHospResidentDept(user_pk);

                        is_charity = con.QuerySingle<string>(
                          $@"SELECT  COUNT(`consult_req_pk`) AS 'y' FROM `consult_request` 
                            WHERE sts_pk  IN ('s','e') AND is_charity = 'y' AND DATE(request_at) = '{dt}' AND assign_dept_pk = @res_dept_pk; "
                          , new { res_dept_pk }, transaction: tran);


                        is_non_charity = con.QuerySingle<string>(
                        $@"SELECT  COUNT(`consult_req_pk`) AS 'y' FROM `consult_request` 
                          WHERE sts_pk  IN ('s','e') AND is_charity = 'n' AND DATE(request_at) = '{dt}' AND assign_dept_pk = @res_dept_pk; "
                        , new { res_dept_pk }, transaction: tran);
                    }

                    string dt_display = (DateTime.Now.AddDays(i * -1)).ToString("MMM. dd");

                    total_charity.Add(new LineDashboardModel
                    {
                        x = dt_display,
                        y = (is_charity ?? "0")
                    });

                    total_non_charity.Add(new LineDashboardModel
                    {
                        x = dt_display,
                        y = (is_non_charity ?? "0")
                    });
                }

                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = new
                    {
                        total_charity,
                        total_non_charity
                    }
                };
            }
            catch (Exception e)
            {
                tran.Rollback();
                return new ResponseModel
                {
                    success = false,
                    message = $"The server has encountered a problem. {e.Message}",
                };
            }
        }

        public ResponseModel GetConsultPerDept()
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                List<LineDashboardModel> chart_items = con.Query<LineDashboardModel>(
                           $@"	SELECT d.`dept_name` 'x', COUNT(cr.`assign_dept_pk`) AS 'y' FROM `department` d 
	                            LEFT JOIN (SELECT assign_dept_pk FROM consult_request WHERE sts_pk <> 'x') cr ON d.`dept_pk` = cr.`assign_dept_pk` 
	                            GROUP BY d.`dept_pk`"
                              , null, transaction: tran).ToList();
                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = chart_items
                };
            }
            catch (Exception e)
            {
                tran.Rollback();
                return new ResponseModel
                {
                    success = false,
                    message = $"The server has encountered a problem. {e.Message}",
                };
            }
        }



    }
}
