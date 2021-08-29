using cms_server.Entities;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Mvc;
using static pos_server.Payloads.ConsultRequestFilePayloads;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class ConsultReqFileController : ControllerBase
    {
        ConsultReqFileRepo consult_req_file_repo = new ConsultReqFileRepo();

        [HttpPost]
        public IActionResult GetTableConsultReqFile(ConsultRequestFileTablePayload payload)
        {
            return Ok(consult_req_file_repo.GetTableConsultReqFile(payload));
        }

        [HttpPost]
        public IActionResult GetConsultReqFileByPk(SingleValuePayload payload)
        {
            return Ok(consult_req_file_repo.GetConsultReqFileByPk(payload.value));
        }

        [HttpPost]
        public IActionResult InsertConsultFile(ConsultRequestFileEntity payload)
        {
            payload.encoded_by = User.Identity.Name;
            return Ok(consult_req_file_repo.InsertConsultFile(payload));
        }

        [HttpPost]
        public IActionResult UpdateConsultFile(ConsultRequestFileEntity payload)
        {
            payload.updated_by = User.Identity.Name;
            return Ok(consult_req_file_repo.UpdateConsultFile(payload));
        }


    }
}
