using cms_server.Entities;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Mvc;
using static cms_server.Payloads.ConsultVitalSignPayloads;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class ConsultVitalSignController : ControllerBase
    {
        ConsultVitalSignRepo dept_res_repo = new ConsultVitalSignRepo();

        [HttpPost]
        public IActionResult InsertConsultVitalSign(ConsultVitalSignEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(dept_res_repo.InsertConsultVitalSign(payload));
        }

        [HttpPost]
        public IActionResult UpdateConsultVitalSign(ConsultVitalSignEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(dept_res_repo.UpdateConsultVitalSign(payload));
        }

        [HttpPost]
        public IActionResult GetTableConsultVitalSign(ConsultVitalSignTablePayload payload)
        {
            return Ok(dept_res_repo.GetTableConsultVitalSign(payload));
        }

        [HttpPost]
        public IActionResult GetConsultVitalSignByConsultVitalSignPk(SingleValuePayload payload)
        {
            return Ok(dept_res_repo.GetConsultVitalSignByPk(payload.value));
        }

    }
}
