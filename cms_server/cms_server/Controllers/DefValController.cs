using claim_form_server.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace claim_form_server.Controllers
{

    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class DefValController : ControllerBase
    {
        DefValRepo def_val_repo = new DefValRepo();

        public IActionResult GetHospitalName()
        {
            return Ok(def_val_repo.GetHospitalName());
        }

        public IActionResult GetHospitalLogo()
        {
            return Ok(def_val_repo.GetHospitalLogo());
        }

        public IActionResult GetConsultDefRegion()
        {
            return Ok(def_val_repo.GetConsultDefRegion());
        }


        public IActionResult GetConsultDefZipcode()
        {
            return Ok(def_val_repo.GetConsultDefZipcode());
        }


    }
}
