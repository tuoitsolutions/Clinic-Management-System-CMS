using cms_server.Hooks;
using cms_server.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        DashboardRepo dashboard_repo = new DashboardRepo();


        [HttpPost]
        [Authorize]
        public IActionResult GetTotalForApproval()
        {

            return Ok(dashboard_repo.GetTotalForApproval(User.Identity.Name));
        }

        [HttpPost]
        [Authorize]
        public IActionResult GetTotalPaid()
        {

            return Ok(dashboard_repo.GetTotalPaid(User.Identity.Name));
        }

        [HttpPost]
        [Authorize]
        public IActionResult GetTotalStarted()
        {

            return Ok(dashboard_repo.GetTotalStarted(User.Identity.Name));
        }

        [HttpPost]
        [Authorize]
        public IActionResult GetTotalEnded()
        {

            return Ok(dashboard_repo.GetTotalEnded(User.Identity.Name));
        }

        [HttpPost]
        [Authorize]
        public IActionResult GetFinishConsult()
        {

            return Ok(dashboard_repo.GetFinishConsult(User.Identity.Name));
        }

        [HttpPost]
        [Authorize]
        public IActionResult GetLatestConsultReqUserDept()
        {

            return Ok(dashboard_repo.GetLatestConsultReqUserDept(User.Identity.Name));
        }

        [HttpPost]
        [Authorize]
        public IActionResult GetLatestConsultForResident()
        {

            return Ok(dashboard_repo.GetLatestConsultForResident(User.Identity.Name));
        }

        [HttpPost]
        [Authorize]
        public IActionResult GetLatestConsultReqOtherDept()
        {

            return Ok(dashboard_repo.GetLatestConsultReqOtherDept(User.Identity.Name));
        }

        [HttpPost]
        [Authorize]
        public IActionResult GetLatestDeptTranLog()
        {

            return Ok(dashboard_repo.GetLatestDeptTranLog());
        }

        [HttpPost]
        [Authorize]
        public IActionResult GetCharity()
        {

            return Ok(dashboard_repo.GetCharity(User.Identity.Name));
        }

        [HttpPost]
        [Authorize]
        public IActionResult GetConsultPerDept()
        {

            return Ok(dashboard_repo.GetConsultPerDept());
        }





    }
}
