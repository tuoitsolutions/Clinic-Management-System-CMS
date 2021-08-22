using cms_server.Entities;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Mvc;
using static cms_server.Payloads.ConsultAllergyPayloads;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class ConsultAllergyController : ControllerBase
    {
        ConsultAllergyRepo dept_res_repo = new ConsultAllergyRepo();

        [HttpPost]
        public IActionResult InsertConsultAllergy(ConsultAllergyEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(dept_res_repo.InsertConsultAllergy(payload));
        }

        [HttpPost]
        public IActionResult UpdateConsultAllergy(ConsultAllergyEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(dept_res_repo.UpdateConsultAllergy(payload));
        }

        [HttpPost]
        public IActionResult GetTableConsultAllergy(ConsultAllergyTablePayload payload)
        {
            return Ok(dept_res_repo.GetTableConsultAllergy(payload));
        }

        [HttpPost]
        public IActionResult GetConsultAllergyByConsultAllergyPk(SingleValuePayload payload)
        {
            return Ok(dept_res_repo.GetConsultAllergyByPk(payload.value));
        }

    }
}
