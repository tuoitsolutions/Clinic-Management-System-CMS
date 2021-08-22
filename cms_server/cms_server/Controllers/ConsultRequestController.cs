using cms_server.Entities;
using cms_server.Hooks;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using pos_server.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
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
        public IActionResult GetTableConsultRequest(ConsultRequestTablePayload payload)
        {
            string user_type = UseClaims.GetUserType((ClaimsIdentity)User.Identity);
            return Ok(consult_req_repo.GetTableConsultRequest(payload, User.Identity.Name, user_type));
        }

        [HttpPost]
        public IActionResult GetConsultReqByPk(SingleValuePayload payload)
        {
            string user_type = UseClaims.GetUserType((ClaimsIdentity)User.Identity);
            return Ok(consult_req_repo.GetConsultReqByPk(payload.value, User.Identity.Name, user_type));
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

        [HttpPost]
        public IActionResult AssignDeptConsult(ConsultRequestEntity payload)
        {
            return Ok(consult_req_repo.AssignDeptConsult(payload, User.Identity.Name));
        }

        [HttpPost]
        public IActionResult ChangeConsultationCost(ConsultRequestEntity payload)
        {
            return Ok(consult_req_repo.ChangeConsultationCost(payload, User.Identity.Name));
        }
    }
}
