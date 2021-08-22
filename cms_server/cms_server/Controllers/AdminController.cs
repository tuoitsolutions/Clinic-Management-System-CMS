using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cms_server.Entities;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pos_server.Payloads;
using static pos_server.Payloads.AdminPayloads;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        AdminRepo admin_repo = new AdminRepo();

        [HttpPost]
        public IActionResult InsertAdmin([FromForm] AdminEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(admin_repo.InsertAdmin(payload));
        }


        [HttpPost]
        public IActionResult UpdateAdmin([FromForm] AdminEntity payload)
        {
            return Ok(admin_repo.UpdateAdmin(payload));
        }

        [HttpPost]
        public IActionResult ResetAdminPassword(AdminEntity payload)
        {
            return Ok(admin_repo.ResetAdminPassword(payload));
        }

        [HttpPost]
        public IActionResult GetTableAdmin(AdminTablePayload payload)
        {
            return Ok(admin_repo.GetTableAdmin(payload));
        }


        [HttpPost]
        public IActionResult GetAdminByAdminPk(SingleValuePayload payload)
        {
            return Ok(admin_repo.GetAdminByAdminPk(payload.value));
        }

        //GetAdminByAdminPk

    }
}
