using claim_form_server.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace claim_form_server.Controllers
{

    [ApiController]
    [Route("api/def/")]
    public class DefValController : ControllerBase
    {
        DefValRepo def_val_repo = new DefValRepo();


        [HttpPost]
        [Route("getHospitalName")]
        public IActionResult getHospitalName()
        {
            return Ok(def_val_repo.GetHospitalName());
        }

        [HttpPost]
        [Route("getHospitalLogo")]
        public IActionResult getHospitalLogo()
        {
            return Ok(def_val_repo.GetHospitalLogo());
        }

    }
}
