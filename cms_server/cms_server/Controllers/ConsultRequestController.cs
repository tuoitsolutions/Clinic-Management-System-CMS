using cms_server.Entities;
using cms_server.Hooks;
using cms_server.Models;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static pos_server.Payloads.ConsultRequestPayloads;

namespace cms_server.Controllers
{


    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]

    public class ConsultRequestController : ControllerBase
    {

        ConsultRequestRepo consult_req_repo = new ConsultRequestRepo();

        [HttpPost]
        public IActionResult InsertConsultRequest([FromForm] ConsultRequestEntity payload)
        {
            return Ok(consult_req_repo.InsertConsultRequest(payload));
        }

        [HttpPost]
        public IActionResult SendPaymentLink(SingleValuePayload payload)
        {
            return Ok(consult_req_repo.SendPaymentLink(payload.value, User.Identity.Name));
        }

        [HttpPost]
        public IActionResult DeclineConsultRequest(SendMessagePayload payload)
        {
            return Ok(consult_req_repo.DeclineConsultRequest(payload, User.Identity.Name));
        }

        [HttpPost]
        public IActionResult UndeclineConsultRequest(SendMessagePayload payload)
        {
            return Ok(consult_req_repo.UndeclineConsultRequest(payload, User.Identity.Name));
        }


        [Authorize]
        [HttpPost]
        public IActionResult GetTableConsultRequest(ConsultRequestTablePayload payload)
        {
            return Ok(consult_req_repo.GetTableConsultRequest(payload, User.Identity.Name));
        }

        [HttpPost]
        public IActionResult GetTablePatConsultHistory(ConsultRequestTablePayload payload)
        {
            return Ok(consult_req_repo.GetTablePatConsultHistory(payload));
        }

        [HttpPost]
        public IActionResult GetConsultReqByPk(SingleValuePayload payload)
        {
            string user_type = UseClaims.GetUserType((ClaimsIdentity)User.Identity);
            return Ok(consult_req_repo.GetConsultReqByPk(payload.value, User.Identity.Name, user_type));
        }

        [HttpPost]
        public IActionResult GetPaymentConsultInfo(SingleValuePayload payload)
        {
            return Ok(consult_req_repo.GetPaymentConsultInfo(payload.value));
        }



        [Authorize]
        [HttpPost]
        public IActionResult GetAssignResidentOnlineConsult(SingleValuePayload payload)
        {
            return Ok(consult_req_repo.GetAssignResidentOnlineConsult(payload.value, User.Identity.Name));
        }

        [HttpPost]
        public IActionResult GetPublicOnlineConsult(SingleValuePayload payload)
        {
            return Ok(consult_req_repo.GetPublicOnlineConsult(payload.value));
        }




        [HttpPost]
        public IActionResult IsPayLinkExpired(SingleValuePayload payload)
        {
            return Ok(consult_req_repo.IsPayLinkExpired(payload.value));
        }

        [HttpPost]
        public IActionResult IsPayOtpVerified(SingleValuePayload payload)
        {
            return Ok(consult_req_repo.IsPayOtpVerified(payload.value));
        }

        [HttpPost]
        public IActionResult VerifyPayOtp(OtpEntity payload)
        {
            return Ok(consult_req_repo.VerifyPayOtp(payload));
        }

        [HttpPost]
        public IActionResult ResendPayOtp(OtpEntity payload)
        {
            return Ok(consult_req_repo.ResendPayOtp(payload));
        }

        [HttpPost]
        public IActionResult PreviewConsultSoa(SingleValuePayload payload)
        {
            return Ok(consult_req_repo.PreviewConsultSoa(payload.value));
        }

        [HttpPost]
        public IActionResult EmailConsultRequestSoa(ConsultRequestEntity payload)
        {
            return Ok(consult_req_repo.EmailConsultRequestSoa(payload, User.Identity.Name));
        }

        [Authorize]
        [HttpPost]
        public IActionResult SetConsultDeptSched(ConsultRequestEntity payload)
        {
            return Ok(consult_req_repo.SetConsultDeptSched(payload, User.Identity.Name));
        }

        [Authorize]
        [HttpPost]
        public IActionResult SendConsultLink(SingleValuePayload payload)
        {
            return Ok(consult_req_repo.SendConsultLink(payload.value, User.Identity.Name));
        }

        [HttpPost]
        public IActionResult ChangeConsultationCost(ConsultRequestEntity payload)
        {
            return Ok(consult_req_repo.ChangeConsultationCost(payload, User.Identity.Name));
        }

        [HttpPost]
        public IActionResult StartConsultation(HospPatientEntity payload)
        {
            payload.last_updated_by = User.Identity.Name;
            return Ok(consult_req_repo.StartConsultation(payload));
        }


        [HttpPost]
        public IActionResult EndConsult(ConsultRequestEntity payload)
        {
            string user_type = UseClaims.GetUserType((ClaimsIdentity)User.Identity);
            payload.last_updated_by = User.Identity.Name;
            return Ok(consult_req_repo.EndConsult(payload));
        }


        [HttpPost]
        public IActionResult TakeOverConsult(ConsultRequestEntity payload)
        {
            string user_type = UseClaims.GetUserType((ClaimsIdentity)User.Identity);
            payload.last_updated_by = User.Identity.Name;
            return Ok(consult_req_repo.TakeOverConsult(payload, user_type));
        }


        [HttpPost]
        public IActionResult MapConsultationToPatient(HospPatientEntity payload)
        {
            payload.last_updated_by = User.Identity.Name;
            return Ok(consult_req_repo.MapConsultationToPatient(payload));
        }

        //[HttpPost]
        //public IActionResult GetCosultLinkInfo(SingleValuePayload payload)
        //{
        //    return Ok(consult_req_repo.GetCosultLinkInfo(payload.value));
        //}

        [HttpPost]
        public IActionResult AuthenticateConsultLink(ConsultRequestEntity payload)
        {
            return Ok(consult_req_repo.AuthenticateConsultLink(payload));
        }

        [HttpPost]
        public IActionResult IsConsultLinkAuthenticated(ConsultRequestEntity payload)
        {
            return Ok(consult_req_repo.IsConsultLinkAuthenticated(payload));
        }

        //
        [HttpPost]
        public IActionResult SetConsultAsPaid(ConsultRequestEntity payload)
        {
            payload.user_pk = User.Identity.Name;
            return Ok(consult_req_repo.SetConsultAsPaid(payload));
        }


        [HttpPost]
        public IActionResult GetConsultPatPic(SingleValuePayload payload)
        {
            return Ok(consult_req_repo.GetConsultPatPic(payload.value));
        }


        [HttpPost]
        public IActionResult UpdateConsultPatPic([FromForm] ConsultRequestEntity payload)
        {
            payload.user_pk = User.Identity.Name;
            return Ok(consult_req_repo.UpdateConsultPatPic(payload));
        }

        [HttpPost]
        public IActionResult GetConsultDocNotes(SingleValuePayload payload)
        {
            return Ok(consult_req_repo.GetConsultDocNotes(payload.value));
        }



        [HttpPost]
        public IActionResult UpdateConsultDocNotes(ConsultRequestEntity payload)
        {
            payload.user_pk = User.Identity.Name;
            return Ok(consult_req_repo.UpdateConsultDocNotes(payload));
        }

        [HttpPost]
        public IActionResult UpdateConsultDtls(ConsultRequestEntity payload)
        {
            payload.user_pk = User.Identity.Name;
            return Ok(consult_req_repo.UpdateConsultDtls(payload));
        }

        [HttpPost]
        public IActionResult SendConsultSms(SmsModel payload)
        {
            payload.encoded_by = User.Identity.Name;
            return Ok(consult_req_repo.SendConsultSms(payload));
        }

        [HttpPost]
        public IActionResult SendConsultEmail(EmailModel payload)
        {
            payload.encoded_by = User.Identity.Name;
            return Ok(consult_req_repo.SendConsultEmail(payload));
        }

        [HttpPost]
        public IActionResult PreviewRequesterPic(SingleValuePayload payload)
        {
            return Ok(consult_req_repo.PreviewRequesterPic(payload.value));
        }

    }
}
