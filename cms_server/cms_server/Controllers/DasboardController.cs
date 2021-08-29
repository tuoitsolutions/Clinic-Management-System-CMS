using cms_server.Hooks;
using cms_server.Repositories;
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
        public IActionResult TotalEarning()
        {
            string user_type = UseClaims.GetUserType((ClaimsIdentity)User.Identity);

            return Ok(dashboard_repo.TotalEarning(User.Identity.Name, user_type));
        }
        [HttpPost]
        public IActionResult TotalConsult()
        {
            string user_type = UseClaims.GetUserType((ClaimsIdentity)User.Identity);
            return Ok(dashboard_repo.TotalConsult(User.Identity.Name, user_type));
        }
        [HttpPost]
        public IActionResult TotalHospPatient()
        {
            string user_type = UseClaims.GetUserType((ClaimsIdentity)User.Identity);
            return Ok(dashboard_repo.TotalHospPatient());
        }

        [HttpPost]
        public IActionResult TotalHospResident()
        {
            string user_type = UseClaims.GetUserType((ClaimsIdentity)User.Identity);
            return Ok(dashboard_repo.TotalHospResident());
        }

        [HttpPost]
        public IActionResult TotalDept()
        {
            return Ok(dashboard_repo.TotalDept());
        }

        [HttpPost]
        public IActionResult ChartDeptEarning()
        {
            return Ok(dashboard_repo.ChartDeptEarning());
        }

        [HttpPost]
        public IActionResult ChartDailyEarning30days()
        {
            string user_type = UseClaims.GetUserType((ClaimsIdentity)User.Identity);
            return Ok(dashboard_repo.ChartDailyEarning30days(User.Identity.Name, user_type));
        }
        [HttpPost]
        public IActionResult StatsConsult()
        {
            string user_type = UseClaims.GetUserType((ClaimsIdentity)User.Identity);
            return Ok(dashboard_repo.StatsConsult(User.Identity.Name, user_type));
        }
        [HttpPost]
        public IActionResult TopResident()
        {
            return Ok(dashboard_repo.TopResident());
        }

        [HttpPost]
        public IActionResult TodayForApprovalConsult()
        {
            return Ok(dashboard_repo.TodayForApprovalConsult());
        }
    }
}
