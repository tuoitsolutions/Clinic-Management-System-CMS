using cms_server.Entities;
using Dapper;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using pos_server.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace cms_server.Repositories
{
    public class HospPatientRepo
    {
        public ResponseModel HospitalPatientOptions()
        {
            using var con = new MySqlConnection(DatabaseConfig.GetConnection());
            con.Open();
            using var tran = con.BeginTransaction();
            try
            {
                var data = con.Query<OptionModel>($@"
                                     SELECT hospital_no id, CONCAT(first_name,' ',last_name,COALESCE(CONCAT(' ',suffix),'')) label FROM `hosp_patient`
                                    ",
                           null, transaction: tran).ToList();
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
                    message = "The process has been terminated. Error Message: " + err.Message
                };
            }
        }

        public ResponseModel GetHosPatientById(string hospital_no)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<HospPatientEntity> table_data = con.Query<HospPatientEntity>(
                    $@" SELECT * FROM `hosp_patient` where hospital_no=@hospital_no limit 1;",
                    new { hospital_no }, transaction: tran).ToList();

                if (table_data.Count > 0)
                {
                    HospPatientEntity selected_row = table_data[0];
                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        data = selected_row
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

    }
}
