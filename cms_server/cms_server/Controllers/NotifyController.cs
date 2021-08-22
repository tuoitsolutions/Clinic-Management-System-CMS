using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using claim_form_server.Payloads;
using DeliveryRoomWatcher.Models.Common;
using DeliveryRoomWatcher.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace claim_form_server.Controllers
{
    [ApiController]
    [Route("api/notify/")]
    public class NotifyController : ControllerBase
    {
        UserRepo _user = new UserRepo();

        [HttpPost]
        [Route("getPatOb")]
        public IActionResult notifyMaintenance(NotifyMaintenancePayloads.NotifyMaintenancePayload payload)
        {
            var user = _user.AuthenticateUser(new AuthUserPayload
            {
                password = payload.password,
                username = payload.username
            });

            //if (user.Count < 1)
            //{
            //    return Ok(new ResponseModel
            //    {
            //        success = false,
            //        message = "You username and/or password is incorrect!"
            //    });
            //}

            return Ok(new ResponseModel
            {
                success = true,
                message = "The notification has been sent successfully."
            });

        }
    }
}
