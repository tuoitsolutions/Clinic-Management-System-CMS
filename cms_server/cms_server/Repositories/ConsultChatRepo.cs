using cms_server.Entities;
using Dapper;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using System;

namespace cms_server.Repositories
{
    public class ConsultChatRepo
    {
        public ResponseModel InsertConsultChat(ConsultReqChatEntity payload, string user_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                if (user_pk != null && payload.user_type.Equals("hosp_resident"))
                {
                    payload.sender_pk = user_pk;
                }

                int insert_row = con.Execute(@"
                         INSERT INTO  `consult_req_chat` SET
                         consult_req_pk=@consult_req_pk,
                         msg_body=@msg_body,
                         sent_at=NOW(),
                         shown='y',
                         sender_pk=@sender_pk,
                         user_type=@user_type,
                         sender_name=@sender_name;
                        ", payload, transaction: tran);

                if (insert_row > 0)
                {
                    tran.Commit();
                    return new ResponseModel
                    {
                        success = true,
                        message = $"Your message has been sent!"
                    };
                }
                else
                {
                    return new ResponseModel
                    {
                        success = false,
                        message = $"There are no rows affected when trying to send the message!"
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


        public ResponseModel GetConsultChat(string consult_req_pk)
        {
            try
            {
                using var con = new MySqlConnection(DatabaseConfig.GetConnection());
                con.Open();
                using var tran = con.BeginTransaction();

                var tbl_data = con.Query<ConsultReqChatEntity>(@"
                        SELECT * FROM `consult_req_chat` where consult_req_pk=@consult_req_pk;
                        ", new { consult_req_pk }, transaction: tran);

                tran.Commit();
                return new ResponseModel
                {
                    success = true,
                    data = tbl_data
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
