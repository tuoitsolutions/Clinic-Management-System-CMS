using cms_server.Entities;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Mvc;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class CommonController : ControllerBase
    {
        CommonRepo common_repo = new CommonRepo();

        [HttpPost]
        public IActionResult GenerateOtp(OtpEntity payload)
        {
            return Ok(common_repo.GenerateOtp(payload));
        }
    }
}
