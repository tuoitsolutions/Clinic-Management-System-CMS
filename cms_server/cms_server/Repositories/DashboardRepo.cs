using cms_server.Entities;
using Dapper;
using ddt_server.Config;
using ddt_server.Hooks;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using static cms_server.Models.DashboardModel;

namespace cms_server.Repositories
{
    public class DashboardRepo
    {
        public ResponseModel TotalEarning(string user_pk, string user_type)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                int total = 0;



                if (user_type == "admin")
                {
                    total = con.QuerySingle<int>($@"
                                     select sum(consult_cost) as total from `consult_request` 
                                     where `pay_at` is not null;
                                    "
                                , null, transaction: tran);
                }
                else if (user_type.Equals("hosp_resident"))
                {
                    total = con.QuerySingle<int>($@"
                                     select sum(consult_cost) as total from `consult_request` 
                                     WHERE `pay_at` is not null 
                                     AND assign_res_pk = (SELECT res_pk FROM `hosp_resident` WHERE `user_pk` = @user_pk LIMIT 1);
                                    "
                                , new { user_pk }, transaction: tran);
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

        public ResponseModel TotalConsult(string user_pk, string user_type)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                int total = 0;

                if (user_type == "admin")
                {
                    total = con.QuerySingle<int>($@"
                                     SELECT COUNT(consult_req_pk) AS total FROM `consult_request` WHERE sts_pk ='e';"
                                    , null, transaction: tran);
                }
                else if (user_type.Equals("hosp_resident"))
                {
                    total = con.QuerySingle<int>($@"
                                     select sum(consult_cost) as total from `consult_request` 
                                     WHERE `pay_at` is not null 
                                     AND assign_res_pk = (SELECT res_pk FROM `hosp_resident` WHERE `user_pk` = @user_pk LIMIT 1);
                                    "
                                , new { user_pk }, transaction: tran);
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

        public ResponseModel TotalHospPatient()
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {

                int total = con.QuerySingle<int>($@"
                                    SELECT COUNT(*) AS total FROM `hosp_patient` 
                                    "
                                     , null, transaction: tran);
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

        public ResponseModel TotalHospResident()
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                int total = con.QuerySingle<int>($@"
                                   SELECT COUNT(*) AS total FROM `hosp_resident` WHERE is_active = 'y'
                                    "
                                    , null, transaction: tran);

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

        public ResponseModel TotalDept()
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                int total = con.QuerySingle<int>($@"
                                   SELECT COUNT(*) AS total FROM `department` WHERE is_active = 'y'
                                    "
                                    , null, transaction: tran);
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

        public ResponseModel ChartDeptEarning()
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                List<LineDashboardModel> chart = con.Query<LineDashboardModel>($@"
                                   SELECT d.`dept_name` AS 'x', COALESCE(dept_earning,'0.00') AS 'y' FROM `department` d LEFT JOIN (
                                     SELECT  assign_dept_pk,SUM(consult_cost) dept_earning  FROM `consult_request` WHERE pay_at IS NOT NULL  GROUP  BY assign_dept_pk 
                                    ) cd ON d.`dept_pk` =  cd.assign_dept_pk  ;"
                                    , null, transaction: tran).ToList();
                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = chart
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

        public ResponseModel ChartDailyEarning30days(string user_pk, string user_type)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                List<LineDashboardModel> total_chart = new List<LineDashboardModel>();

                for (int i = 0; i < 31; i++)
                {
                    string dt = (DateTime.Now.AddDays(i * -1)).ToString("yyyy-MM-dd");

                    string chart_item = null;
                    if (user_type == "admin")
                    {
                        chart_item = con.QuerySingleOrDefault<string>($@"
                                   SELECT  SUM(`consult_cost`) AS 'y' FROM `consult_request` 
                                    WHERE pay_at IS NOT NULL AND DATE(request_at) = '{dt}'"
                                       , null, transaction: tran);
                    }
                    else if (user_type.Equals("hosp_resident"))
                    {
                        chart_item = con.QuerySingleOrDefault<string>($@"
                                   SELECT  SUM(`consult_cost`) AS 'y' FROM `consult_request` 
                                    WHERE pay_at IS NOT NULL AND DATE(request_at) = '{dt}' 
                                    AND assign_res_pk = (SELECT res_pk FROM `hosp_resident` WHERE `user_pk` = @user_pk LIMIT 1);"
                                    , new { user_pk }, transaction: tran);
                    }

                    total_chart.Add(new LineDashboardModel
                    {
                        x = dt,
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

        public ResponseModel StatsConsult(string user_pk, string user_type)
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {

                string sql = "";
                if (user_type == "admin")
                {
                    sql = $@"SELECT COUNT(cr.`consult_req_pk`) AS total ,sm.sts_desc label,sm.`sts_bg_color` bg_color FROM `status_master` sm LEFT JOIN 
                                    consult_request cr  ON cr.`sts_pk` = sm.`sts_pk` GROUP BY sm.sts_pk;";
                }
                else if (user_type.Equals("hosp_resident"))
                {
                    sql = $@"SELECT COUNT(cr.`consult_req_pk`) AS total ,sm.sts_desc label,sm.`sts_bg_color` bg_color FROM `status_master` sm LEFT JOIN 
                                    consult_request cr  ON cr.`sts_pk` = sm.`sts_pk` GROUP BY sm.sts_pk
                                    AND cr.assign_res_pk = (SELECT res_pk FROM `hosp_resident` WHERE `user_pk` = @user_pk LIMIT 1);";
                }

                List<PieDashboardModel> chart = con.Query<PieDashboardModel>(sql, new { user_pk }, transaction: tran).ToList();
                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = chart
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

        public ResponseModel TopResident()
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                List<HospResidentEntity> chart = con.Query<HospResidentEntity>($@"
                                                 SELECT hr.*,cr.total_consult, s.`spcldesc` AS specialty  FROM `hosp_resident` hr
                                                JOIN (SELECT assign_res_pk, COUNT(consult_req_pk) total_consult FROM `consult_request` cr WHERE assign_res_pk IS NOT NULL GROUP BY `assign_res_pk`    ORDER BY  COUNT(consult_req_pk)
                                                ) AS cr ON hr.`res_pk` = cr.assign_res_pk 
                                                LEFT JOIN docspecialtymaster s ON hr.`spclty_pk` = s.`spclcode`                             
                                                 ORDER BY cr.total_consult DESC LIMIT 10"
                                                , null, transaction: tran).ToList();

                foreach (var r in chart)
                {
                    byte[] img_byte_arr = UseFtp.DownloadFtp(r.pic_dest, DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
                    if (img_byte_arr != null)
                    {
                        r.pic_dest = Convert.ToBase64String(img_byte_arr);
                    }
                }
                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = chart
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

        public ResponseModel TodayForApprovalConsult()
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                List<ConsultRequestEntity> chart = con.Query<ConsultRequestEntity>($@"
                                   SELECT * FROM `consult_request` WHERE sts_pk = 'fa'  AND DATE(`request_at`) = DATE(NOW())
                                   #SELECT * FROM `consult_request` WHERE sts_pk = 'fa'  AND DATE(`request_at`) = DATE('2021-08-25')
                                    "
                                    , null, transaction: tran).ToList();
                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = chart
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
