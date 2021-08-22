using cms_server.Entities;
using Dapper;
using ddt_server.Config;
using ddt_server.Hooks;
using ddt_server.Models;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Hooks;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using static cms_server.Payloads.ConsultProcPayloads;

namespace cms_server.Repositories
{
    public class ConsultProcRepo
    {

        public ResponseModel InsertConsultProc(ConsultProcEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                int add_dept = con.Execute(@"
                        INSERT INTO `consult_req_proc` SET
                        consult_req_pk=@consult_req_pk,
                        proc_no=@proc_no,
                        proc_desc=@proc_desc,
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
                        message = $"The item has been added successfully!"
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"There are no rows affected when trying to add the item!"
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

        public ResponseModel UpdateConsultProc(ConsultProcEntity payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                int edit_dept = con.Execute(@"
                        UPDATE `consult_req_proc` SET
                        proc_no=@proc_no,
                        proc_desc=@proc_desc,
                        notes=@notes,
                        is_active=@is_active,
                        encoded_at=NOW(),
                        encoder_pk=@encoder_pk
                        WHERE cr_proc_pk=@cr_proc_pk;
                        ", payload, transaction: tran);


                if (edit_dept > 0)
                {

                    LogModel log_payload = new LogModel
                    {
                        activity = $"The vital sign with ID {payload.cr_proc_pk} has been updated!",
                        encoded_by = payload.encoder_pk,
                        ref_pk = payload.cr_proc_pk.ToString(),
                        ref_table = "consult_req_proc"
                    };

                    int inserted_log = con.Execute($@"
                                         insert into logs set
                                         ref_pk=@ref_pk,
                                         ref_table=@ref_table,
                                         activity=@activity,
                                         encoded_at = now(),
                                         encoded_by=@encoded_by;
                                        "
                                , log_payload, transaction: tran);


                    if (inserted_log > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            message = $"The item has been updated successfully!"
                        };
                    }
                    else
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = $"There are no rows affected when audit the action!"
                        };
                    }
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"There are no rows affected when trying to update the item!"
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

        public ResponseModel GetTableConsultProc(ConsultProcTablePayload payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<ConsultProcEntity> table_data = con.Query<ConsultProcEntity>($@"
                                       SELECT * FROM (
                                        SELECT * FROM `consult_req_proc`
                                        ) AS view_tmp
                                       WHERE
                                       `consult_req_pk` = @consult_req_pk
                                       AND COALESCE(proc_desc,'') LIKE CONCAT('%',@proc_desc,'%')
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
                        payload.page.begin,
                        count,
                        payload.page.limit
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

        public ResponseModel GetConsultProcByPk(string id)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<ConsultProcEntity> table_data = con.Query<ConsultProcEntity>(
                    $@"SELECT * FROM consult_req_proc where cr_proc_pk=@id limit 1;",
                    new { id }, transaction: tran).ToList();

                if (table_data.Count > 0)
                {
                    ConsultProcEntity selected_admin = table_data[0];

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
                        message = "The item that you are trying to retrieve does not exist!"
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
