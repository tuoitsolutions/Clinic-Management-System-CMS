using cms_server.Entities;
using cms_server.Hooks;
using Dapper;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Models.Common;
using MySql.Data.MySqlClient;
using System;

namespace cms_server.Repositories
{
    public class CommonRepo
    {
        public ResponseModel GenerateOtp(OtpEntity payload)
        {

            if (payload.mob_no == null)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "Please enter a valid mobile number!"
                };
            }

            if (payload.user_pk == null)
            {
                return new ResponseModel
                {
                    success = false,
                    message = "There is user associated to this mobile number"
                };
            }
            using (var con = new MySqlConnection(DatabaseConfig.GetConnection()))
            {
                con.Open();
                using var tran = con.BeginTransaction();
                try
                {
                    payload.otp_code = UseOtp.create();


                    con.Execute($@"delete from otp where mob_no=@mob_no;",
                               payload, transaction: tran);

                    int otp_affected_rows = con.Execute($@"
                                     INSERT INTO OTP set mob_no=@mob_no,user_pk=@user_pk, otp_code=@otp_code;
                                    ",
                              payload, transaction: tran);

                    if (otp_affected_rows > 0)
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = true,
                            message = "The one-time passcode has been generated and will be sent to your mobile number!"
                        };
                    }
                    else
                    {
                        tran.Commit();
                        return new ResponseModel
                        {
                            success = false,
                            message = "Unable to generate a new one-time passcode. Please try again!"
                        };
                    }


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
}
