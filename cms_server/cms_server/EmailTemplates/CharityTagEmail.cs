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
    public class CharityTagEmail
    {
        DefValRepo def_val_repo = new DefValRepo();

        public ResponseModel SendCharityEmail(ConsultRequestEntity consult_info)
        {

            string brand_name = def_val_repo.GetHospitalName().data.ToString();
            string brand_initial = def_val_repo.GetHospitalInitial().data.ToString();

            string email_body =
                $@"<div style='font-family: Verdana;'>
                     <div style='text-align: center; '>
                         <h3>Your Out-Patient Telemedicine consultation is now tagged as Charity and the eConsultRoom is now ready for visiting!</h3>
                     </div>
                     <h4>Peace be with you,</h4>
                        <p>
                            Your consultation request has been tagged as Charity. Thus, you can skip or disregard the ePayLink process.
                        </p> 
                        <p>
                            The eConsultRoom for your Out-Patient Telemedicine online consultation with code <b>{consult_info.consult_req_pk}</b> will approximately start {(consult_info.est_start_at == null ? "soon" : "at " + consult_info.est_start_at?.ToString("MMM. dd, yyyy hh:mm tt"))}. 
                            To join,  <a href='{DefaultConfig._clientBaseUrl}online-consultation/{consult_info.hash_key}' target='__blank' >kindly visit this link</a>
                            then enter the password <b>{consult_info.consult_link_pass}</b>. 
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

            ResponseModel email_response = UseEmail.SendEmail(brand_name, consult_info.email, email_body, $"{brand_initial}-eConsultRoom");
            return email_response;
        }
    }
}
