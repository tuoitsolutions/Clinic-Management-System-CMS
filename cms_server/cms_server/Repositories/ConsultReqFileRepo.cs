using cms_server.Entities;
using Dapper;
using ddt_server.Config;
using ddt_server.Hooks;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Hooks;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using static pos_server.Payloads.ConsultRequestFilePayloads;

namespace cms_server.Repositories
{
    public class ConsultReqFileRepo
    {

        public ResponseModel GetTableConsultReqFile(ConsultRequestFileTablePayload payload)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();
                List<ConsultRequestFileEntity> table_data = con.Query<ConsultRequestFileEntity>($@"
                                       SELECT * FROM `consult_request_file`
                                       WHERE
                                       consult_req_pk=@consult_req_pk
                                       AND COALESCE(file_name,'') LIKE CONCAT('%',@file_name,'%')
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

        public ResponseModel GetConsultReqFileByPk(string cr_file_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                List<ConsultRequestFileEntity> table_data = con.Query<ConsultRequestFileEntity>(
                    $@" SELECT * FROM consult_request_file where cr_file_pk=@cr_file_pk limit 1;",
                    new { cr_file_pk }, transaction: tran).ToList();

                if (table_data.Count > 0)
                {
                    ConsultRequestFileEntity selected_admin = table_data[0];

                    byte[] img_byte_arr = UseFtp.DownloadFtp(selected_admin.file_dest, DefaultConfig.ftp_user, DefaultConfig.ftp_pass);
                    if (img_byte_arr != null)
                    {
                        selected_admin.file_dest = Convert.ToBase64String(img_byte_arr);
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
