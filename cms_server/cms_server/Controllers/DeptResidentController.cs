using cms_server.Entities;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Mvc;
using static pos_server.Payloads.DeptResidentPayloads;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class DeptResidentController : ControllerBase
    {
        DeptResidentRepo dept_res_repo = new DeptResidentRepo();

        [HttpPost]
        public IActionResult InsertDeptResident(DeptResidentEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(dept_res_repo.InsertDeptResident(payload));
        }

        [HttpPost]
        public IActionResult UpdateDeptResident(DeptResidentEntity payload)
        {
            return Ok(dept_res_repo.UpdateDeptResident(payload));
        }

        [HttpPost]
        public IActionResult GetTableDeptResident(DeptResidentTablePayload payload)
        {
            return Ok(dept_res_repo.GetTableDeptResident(payload));
        }

        [HttpPost]
        public IActionResult GetDeptResidentByDeptResidentPk(SingleValuePayload payload)
        {
            return Ok(dept_res_repo.GetDeptResidentByPk(payload.value));
        }

    }
}
