using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace pos_server.Filters
{
    public class CustomMacAddressFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {

            //var h = actionContext.Request.Headers;
            //var mac = h.GetValues("MacAddress").First();

            //if (mac.Equals(""))
            //{
            //    actionContext.Result = new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(new
            //    {
            //        succces = false,
            //        message = "Mac Address is required"
            //    });
            //}

            actionContext.Result = new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(new
            {
                succces = false,
                message = "Mac Address is required"
            });

        }
    }
}
