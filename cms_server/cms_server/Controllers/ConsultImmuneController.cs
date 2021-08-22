using cms_server.Entities;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Mvc;
using static cms_server.Payloads.ConsultImmunePayloads;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class ConsultImmuneController : ControllerBase
    {
        ConsultImmuneRepo dept_res_repo = new ConsultImmuneRepo();

        [HttpPost]
        public IActionResult InsertConsultImmune(ConsultImmuneEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(dept_res_repo.InsertConsultImmune(payload));
        }

        [HttpPost]
        public IActionResult UpdateConsultImmune(ConsultImmuneEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(dept_res_repo.UpdateConsultImmune(payload));
        }

        [HttpPost]
        public IActionResult GetTableConsultImmune(ConsultImmuneTablePayload payload)
        {
            return Ok(dept_res_repo.GetTableConsultImmune(payload));
        }

        [HttpPost]
        public IActionResult GetConsultImmuneByConsultImmunePk(SingleValuePayload payload)
        {
            return Ok(dept_res_repo.GetConsultImmuneByPk(payload.value));
        }

    }
}
