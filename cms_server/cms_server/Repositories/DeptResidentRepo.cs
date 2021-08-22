using cms_server.Entities;
using Dapper;
using ddt_server.Config;
using ddt_server.Hooks;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Hooks;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using pos_server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using static pos_server.Payloads.DeptResidentPayloads;

namespace cms_server.Repositories
{
    public class DeptResidentRepo
    {

        public ResponseModel InsertDeptResident(DeptResidentEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                int add_dept = con.Execute(@"
                        INSERT INTO dept_resident
                        SET
                        dept_pk=@dept_pk,
                        res_pk=@res_pk,
                        notes=@notes,
                        is_active=@is_active,
                        encoded_at=NOW(),
                        encoder_pk=@encoder_pk;
                        ", payload, transaction: tran);

                if (add_dept > 0)
                {
                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        message = $"The resident has been assigned to the department!"
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"There are no rows affected when trying to add the new department!"
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

        public ResponseModel UpdateDeptResident(DeptResidentEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                int edit_dept = con.Execute(@"
                        UPDATE dept_resident
                        SET
                        notes=@notes,
                        is_active=@is_active
                        WHERE dept_res_pk =@dept_res_pk;
                        ", payload, transaction: tran);

                if (edit_dept > 0)
                {
                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        message = $"The record has been updated successfully!"
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"There are no rows affected when trying to update the department!"
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

        public ResponseModel GetTableDeptResident(DeptResidentTablePayload payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<DeptResidentEntity> table_data = con.Query<DeptResidentEntity>($@"
                                       SELECT * FROM (
                                        SELECT dr.*, d.`dept_name`,hr.first_name,hr.last_name FROM `dept_resident` dr
                                        JOIN `hosp_resident` hr ON hr.`res_pk` =  dr.`res_pk`
                                        JOIN `department` d ON d.`dept_pk` = dr.`dept_pk`
                                        WHERE dr.dept_pk = @dept_pk
                                        ) AS view_tmp
                                       WHERE
                                       COALESCE(first_name,'') LIKE CONCAT('%',@first_name,'%')
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

                foreach (var row in table_data)
                {

                    row.hosp_res = con.QuerySingleOrDefault<HospResidentEntity>($@"
                                       SELECT * FROM (
                                        SELECT r.*, s.`spcldesc` AS specialty FROM `hosp_resident` r
                                        LEFT JOIN docspecialtymaster s ON r.`spclty_pk` = s.`spclcode`
                                        ) AS tmp_view where res_pk=@res_pk limit 1;
                            ", new { row.res_pk }, transaction: tran);

                    byte[] img_byte_arr = UseFtp.DownloadFtp(row.hosp_res.pic_dest, DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
                    if (img_byte_arr != null)
                    {
                        row.hosp_res.pic_dest = Convert.ToBase64String(img_byte_arr);
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

        public ResponseModel GetDeptResidentByPk(string dept_res_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<DeptResidentEntity> table_data = con.Query<DeptResidentEntity>(
                    $@" SELECT * FROM dept_resident where dept_res_pk=@dept_res_pk limit 1;",
                    new { dept_res_pk }, transaction: tran).ToList();

                if (table_data.Count > 0)
                {
                    DeptResidentEntity selected_admin = table_data[0];

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

        public ResponseModel GetDeptResidentOptions(string dept_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<OptionModel> table_data = con.Query<OptionModel>($@"
                                                SELECT * FROM (
                                                SELECT dr.`res_pk` id,CONCAT( hr.`last_name`,', ',hr.`first_name`,IF(hr.`suffix` IS NULL, '',CONCAT(' ',hr.`suffix`))) label FROM `dept_resident` dr
                                                JOIN `hosp_resident` hr ON dr.`res_pk` = hr.`res_pk` 
                                                 WHERE dr.`is_active` = 'y' AND dr.`dept_pk` = @dept_pk
                                                ) AS tmp;"
                                                , new { dept_pk }, transaction: tran).ToList();
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
                    message = "The process has been terminated.Error Message: " + err.Message
                };
            }
        }
    }
}
