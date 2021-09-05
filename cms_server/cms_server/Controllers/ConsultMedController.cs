using cms_server.Entities;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Mvc;
using static cms_server.Payloads.ConsultMedPayloads;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class ConsultMedController : ControllerBase
    {
        ConsultMedRepo dept_res_repo = new ConsultMedRepo();

        [HttpPost]
        public IActionResult InsertConsultMed(ConsultMedEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(dept_res_repo.InsertConsultMed(payload));
        }

        [HttpPost]
        public IActionResult UpdateConsultMed(ConsultMedEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(dept_res_repo.UpdateConsultMed(payload));
        }

        [HttpPost]
        public IActionResult GetTableConsultMed(ConsultMedTablePayload payload)
        {
            return Ok(dept_res_repo.GetTableConsultMed(payload));
        }

        [HttpPost]
        public IActionResult GetConsultMedByPk(SingleValuePayload payload)
        {
            return Ok(dept_res_repo.GetConsultMedByPk(payload.value));
        }

        [HttpPost]
        public IActionResult PreviewMedPrescrip(SingleValuePayload payload)
        {
            return Ok(dept_res_repo.PreviewMedPrescrip(payload.value, User.Identity.Name));
        }

        [HttpPost]
        public IActionResult EmailMedPrescrip(ConsultMedEntity payload)
        {
            return Ok(dept_res_repo.EmailMedPrescrip(payload, User.Identity.Name));
        }


    }
}
