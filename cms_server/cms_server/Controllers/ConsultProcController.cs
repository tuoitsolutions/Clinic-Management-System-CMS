using cms_server.Entities;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Mvc;
using static cms_server.Payloads.ConsultProcPayloads;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class ConsultProcController : ControllerBase
    {
        ConsultProcRepo dept_res_repo = new ConsultProcRepo();

        [HttpPost]
        public IActionResult InsertConsultProc(ConsultProcEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(dept_res_repo.InsertConsultProc(payload));
        }

        [HttpPost]
        public IActionResult UpdateConsultProc(ConsultProcEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(dept_res_repo.UpdateConsultProc(payload));
        }

        [HttpPost]
        public IActionResult GetTableConsultProc(ConsultProcTablePayload payload)
        {
            return Ok(dept_res_repo.GetTableConsultProc(payload));
        }

        [HttpPost]
        public IActionResult GetConsultProcByPk(SingleValuePayload payload)
        {
            return Ok(dept_res_repo.GetConsultProcByPk(payload.value));
        }


        [HttpPost]
        public IActionResult PreviewProcPrescrip(SingleValuePayload payload)
        {
            return Ok(dept_res_repo.PreviewProcPrescrip(payload.value));
        }


        [HttpPost]
        public IActionResult EmailProcPrescrip(ConsultProcEntity payload)
        {
            return Ok(dept_res_repo.EmailProcPrescrip(payload, User.Identity.Name));
        }

    }
}
