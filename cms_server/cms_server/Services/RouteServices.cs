using DeliveryRoomWatcher.Models.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;

namespace DeliveryRoomWatcher.Services
{
    public class RouteServices : IServices
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {
            //services.AddControllers();
            services.AddMvc()
       .ConfigureApiBehaviorOptions(opt
           =>
       {
           opt.InvalidModelStateResponseFactory =
               (context =>
               {
                   var errors = context.ModelState.Values;

                   var listErrors = new List<string>();

                   foreach (var err in errors)
                   {
                       foreach (var errMessage in err.Errors)
                       {
                           if (!errMessage.ErrorMessage.Trim().Equals(""))
                           {
                               listErrors.Add(errMessage.ErrorMessage);
                           }
                       }
                   }
                   return new OkObjectResult(new ResponseModel { success = false, errors = listErrors });
               });
       });



        }


    }
}
