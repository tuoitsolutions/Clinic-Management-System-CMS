using cms_server.Entities;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Mvc;
using static cms_server.Payloads.ConsultMedProbPayloads;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class ConsultMedProbController : ControllerBase
    {
        ConsultMedProbRepo dept_res_repo = new ConsultMedProbRepo();

        [HttpPost]
        public IActionResult InsertConsultMedProb(ConsultMedProbEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(dept_res_repo.InsertConsultMedProb(payload));
        }

        [HttpPost]
        public IActionResult UpdateConsultMedProb(ConsultMedProbEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(dept_res_repo.UpdateConsultMedProb(payload));
        }

        [HttpPost]
        public IActionResult GetTableConsultMedProb(ConsultMedProbTablePayload payload)
        {
            return Ok(dept_res_repo.GetTableConsultMedProb(payload));
        }

        [HttpPost]
        public IActionResult GetConsultMedProbByConsultMedProbPk(SingleValuePayload payload)
        {
            return Ok(dept_res_repo.GetConsultMedProbByPk(payload.value));
        }

    }
}
