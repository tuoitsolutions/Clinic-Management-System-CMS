using claim_form_server.Repositories;
using cms_server.Entities;
using ddt_server.Config;
using ddt_server.Hooks;
using DeliveryRoomWatcher.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.EmailTemplates
{
    public class PaymentLinkEmail
    {
        DefValRepo def_val_repo = new DefValRepo();
        public ResponseModel CreatePaymentLinkEmail(ConsultRequestEntity consult_info)
        {

            string brand_name = def_val_repo.GetHospitalName().data.ToString();
            string brand_initial = def_val_repo.GetHospitalInitial().data.ToString();

            string email_body =
                $@"<div style='font-family: Verdana;'>
                     <div style='text-align: center; '>
                         <h3 style='color: red'>Your Out-Patient Telemedicine ePayLink is now ready for visiting!</h3>
                      </div>
                     <h4>Peace be with you,</h4>
                        <p>
                            The ePayLink for your online consultation request with code <b>{consult_info.consult_req_pk}</b> is now available. 
                            To access it,  <a href='{DefaultConfig._clientBaseUrl}consultation-payment/{consult_info.hash_key}' target='__blank' >kindly visit this link</a>
                            then enter the 6 (six) digit OTP that was sent to your mobile number (<b>{consult_info.mob_no}</b>). 
                        </p> 
                       <div>
                       <br />
                       <br />
                       <small>
                           <em>
                            This is a system generated message, do not reply.
                           </em>
                       </small>
                       </div>
                   </div>";

            ResponseModel email_response = UseEmail.SendEmail(brand_name, consult_info.email, email_body, $"{brand_initial}-ePayLink");
            return email_response;
        }

    }
}
