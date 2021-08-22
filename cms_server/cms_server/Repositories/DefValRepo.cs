using Dapper;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using System;
using System.Linq;

namespace claim_form_server.Repositories
{
    public class DefValRepo
    {
        public ResponseModel GetHospitalName()
        {
            try
            {
                using MySqlConnection con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                var data = con.QuerySingle<string>($@"SELECT val FROM `def_val` WHERE remarks = 'hosp_name'"
                                 , null, transaction: tran);
                return new ResponseModel
                {
                    success = true,
                    data = data
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

        public ResponseModel GetHospitalInitial()
        {
            try
            {
                using MySqlConnection con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                var data = con.QuerySingle<string>($@"SELECT val FROM `def_val` WHERE remarks = 'hosp_initial'"
                                 , null, transaction: tran);
                return new ResponseModel
                {
                    success = true,
                    data = data
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

        public ResponseModel GetHospitalLogo()
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using (var tran = con.BeginTransaction())
                {
                    string logo = Convert.ToBase64String(con.QuerySingle<byte[]>($@"
                                        SELECT logo  FROM def_logo limit 1
                                        "
                                     , null, transaction: tran));
                    return new ResponseModel
                    {
                        success = true,
                        data = logo
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

        public ResponseModel GetHospitalPhone()
        {
            try
            {
                using (var con = new MySqlConnection(DatabaseConfig.GetConnection()))
                {
                    con.Open();
                    using (var tran = con.BeginTransaction())
                    {
                        var data = con.QuerySingle<string>($@"
                                        SELECT val FROM `def_val` WHERE remarks = 'hospital_phone'
                                        "
                                         , null, transaction: tran);
                        return new ResponseModel
                        {
                            success = true,
                            data = data
                        };
                    }
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

        public ResponseModel GetHospitalAddress()
        {
            try
            {
                using (var con = new MySqlConnection(DatabaseConfig.GetConnection()))
                {
                    con.Open();
                    using (var tran = con.BeginTransaction())
                    {
                        var data = con.QuerySingle<string>($@"
                                        SELECT val FROM `def_val` WHERE remarks = 'hospital_address'
                                        "
                                         , null, transaction: tran);
                        return new ResponseModel
                        {
                            success = true,
                            data = data
                        };
                    }
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


        public DateTime getCf4MaintenanceDateTime()
        {
            try
            {
                using (var con = new MySqlConnection(DatabaseConfig.GetConnection()))
                {
                    con.Open();
                    using (var tran = con.BeginTransaction())
                    {
                        var data = con.QuerySingleOrDefault<DateTime>($@"
                                        SELECT `GetDefaultValue`('CF4_MAINTENANCE_DATETIME') 
                                        "
                                         , null, transaction: tran);

                        return data;
                    }
                }

            }
            catch (Exception)
            {
                return DateTime.MinValue;
            }
        }

    }
}
