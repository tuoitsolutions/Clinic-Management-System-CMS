using cms_server.Entities;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Mvc;
using static pos_server.Payloads.DepartmentPayloads;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        DepartmentRepo admin_repo = new DepartmentRepo();

        [HttpPost]
        public IActionResult InsertDepartment(DepartmentEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(admin_repo.InsertDepartment(payload));
        }

        [HttpPost]
        public IActionResult UpdateDepartment(DepartmentEntity payload)
        {
            return Ok(admin_repo.UpdateDepartment(payload));
        }

        [HttpPost]
        public IActionResult GetTableDepartment(DepartmentTablePayload payload)
        {
            return Ok(admin_repo.GetTableDepartment(payload));
        }

        [HttpPost]
        public IActionResult GetDepartmentByDepartmentPk(SingleValuePayload payload)
        {
            return Ok(admin_repo.GetDepartmentByDeptPk(payload.value));
        }

    }
}
