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
using static pos_server.Payloads.HospResidentPayloads;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class HospResidentController : ControllerBase
    {
        HospResidentRepo hosp_res_repo = new HospResidentRepo();

        [HttpPost]
        public IActionResult InsertHospResident([FromForm] HospResidentEntity payload)
        {
            payload.encoder_pk = User.Identity.Name;
            return Ok(hosp_res_repo.InsertHospResident(payload));
        }

        [HttpPost]
        public IActionResult UpdateHospResident([FromForm] HospResidentEntity payload)
        {
            return Ok(hosp_res_repo.UpdateHospResident(payload));
        }

        [HttpPost]
        public IActionResult GetTableHospResident(HospResidentTablePayload payload)
        {
            return Ok(hosp_res_repo.GetTableHospResident(payload));
        }

        [HttpPost]
        public IActionResult GetHospResidentByHospResidentPk(SingleValuePayload payload)
        {
            return Ok(hosp_res_repo.GetHospResidentByHospResidentPk(payload.value));
        }

    }
}
