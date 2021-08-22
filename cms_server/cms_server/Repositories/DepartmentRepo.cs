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
using static pos_server.Payloads.AdminPayloads;
using static pos_server.Payloads.DepartmentPayloads;

namespace cms_server.Repositories
{
    public class DepartmentRepo
    {
        public ResponseModel InsertDepartment(DepartmentEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                int add_dept = con.Execute(@"
                        INSERT INTO department
                        SET
                        dept_code=@dept_code,
                        dept_name=@dept_name,
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
                        message = $"The department {payload.dept_name} has been added successfully!"
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

        public ResponseModel UpdateDepartment(DepartmentEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                int edit_dept = con.Execute(@"
                        UPDATE department
                        SET
                        dept_code=@dept_code,
                        dept_name=@dept_name,
                        notes=@notes,
                        is_active=@is_active
                        WHERE dept_pk =@dept_pk;
                        ", payload, transaction: tran);

                if (edit_dept > 0)
                {
                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        message = $"The department {payload.dept_name} has been updated successfully!"
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

        public ResponseModel GetTableDepartment(DepartmentTablePayload payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<DepartmentEntity> table_data = con.Query<DepartmentEntity>($@"
                                       SELECT * FROM `department`
                                       WHERE
                                       COALESCE(dept_name,'') LIKE CONCAT('%',@dept_name,'%')
                                       {UseFilter.GenerateSearchEqualOrDefault("AND", "dept_code", "@dept_code")}
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

        public ResponseModel GetDepartmentByDeptPk(string dept_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<DepartmentEntity> table_data = con.Query<DepartmentEntity>(
                    $@" SELECT * FROM department where dept_pk=@dept_pk limit 1;",
                    new { dept_pk }, transaction: tran).ToList();

                if (table_data.Count > 0)
                {
                    DepartmentEntity selected_row = table_data[0];

                    selected_row.user = con.QuerySingle<UserEntity>(
                        $@"SELECT full_name FROM users where user_pk=@user_pk limit 1;"
                        , new { user_pk = selected_row.encoder_pk }, transaction: tran);

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

        public ResponseModel GetDepartmentOptions()
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<OptionModel> table_data = con.Query<OptionModel>($@"
                                     SELECT dept_pk id, concat(dept_code,'-',dept_name) label FROM `department` WHERE is_active = 'y' order BY dept_name ASC"
                                     , null, transaction: tran).ToList();
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
