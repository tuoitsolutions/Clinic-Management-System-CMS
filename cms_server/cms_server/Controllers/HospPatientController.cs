using cms_server.Entities;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Mvc;
using static pos_server.Payloads.DepartmentPayloads;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class HospPatientController : ControllerBase
    {
        HospPatientRepo hosp_pat_repo = new HospPatientRepo();

        [HttpPost]
        public IActionResult GetHosPatientById(SingleValuePayload payload)
        {
            return Ok(hosp_pat_repo.GetHosPatientById(payload.value));
        }

    }
}
