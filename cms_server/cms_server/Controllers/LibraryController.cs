using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Mvc;

namespace pos_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class LibraryController : ControllerBase
    {
        LibraryRepo lib_repo = new LibraryRepo();
        HospResidentRepo hosp_res_repo = new HospResidentRepo();
        DeptResidentRepo dept_res_repo = new DeptResidentRepo();
        DepartmentRepo dept_repo = new DepartmentRepo();

        [HttpPost]
        public IActionResult RegionOptions()
        {
            return Ok(lib_repo.RegionOptions());
        }

        [HttpPost]
        public IActionResult ProvinceOptions(SingleValuePayload payload)
        {
            return Ok(lib_repo.ProvinceOptions(payload.value));
        }

        [HttpPost]
        public IActionResult CityMunOptions(SingleValuePayload payload)
        {
            return Ok(lib_repo.CityMunOptions(payload.value));
        }

        [HttpPost]
        public IActionResult BarangayOptions(SingleValuePayload payload)
        {
            return Ok(lib_repo.BarangayOptions(payload.value));
        }

        [HttpPost]
        public IActionResult NationalityOptions()
        {
            return Ok(lib_repo.NationalityOptions());
        }

        [HttpPost]
        public IActionResult ReligionOptions()
        {
            return Ok(lib_repo.ReligionOptions());
        }

        [HttpPost]
        public IActionResult DoctorSpecialtyOptions()
        {
            return Ok(lib_repo.DoctorSpecialtyOptions());
        }

        [HttpPost]
        public IActionResult GetDepartmentOptions()
        {
            return Ok(dept_repo.GetDepartmentOptions());
        }

        [HttpPost]
        public IActionResult GetHospResidentOptions(SingleValuePayload payload)
        {
            return Ok(hosp_res_repo.GetHospResidentOptions(payload.value));
        }

        [HttpPost]
        public IActionResult GetDeptResidentOptions(SingleValuePayload payload)
        {
            return Ok(dept_res_repo.GetDeptResidentOptions(payload.value));
        }
    }
}
