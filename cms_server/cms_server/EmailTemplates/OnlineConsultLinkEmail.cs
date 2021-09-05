using claim_form_server.Repositories;
using cms_server.Entities;
using ddt_server.Config;
using ddt_server.Hooks;
using DeliveryRoomWatcher.Models.Common;

namespace cms_server.EmailTemplates
{
    public class OnlineConsultLinkEmail
    {
        DefValRepo def_val_repo = new DefValRepo();

        public ResponseModel CreateOnlineConsultLinkEmail(ConsultRequestEntity consult_info)
        {

            string brand_name = def_val_repo.GetHospitalName().data.ToString();
            string brand_initial = def_val_repo.GetHospitalInitial().data.ToString();

            string email_body =
                $@"<div style='font-family: Verdana;'>
                     <div style='text-align: center; '>
                         <h3 style='color: red'>Your Out-Patient Telemedicine eConsultRoom is now ready for visiting!</h3>
                      </div>
                     <h4>Peace be with you,</h4>
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
