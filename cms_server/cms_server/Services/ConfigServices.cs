using DeliveryRoomWatcher.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace cms_web_api.Services
{
    public class ConfigServices : IServices
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers().AddNewtonsoftJson();
            services.AddSignalR();
            //services.AddCors(options =>
            //{
            //    options.AddPolicy("ClientPermission", policy =>
            //    {
            //        policy.AllowAnyHeader()
            //            .AllowAnyMethod()
            //            .WithOrigins("http://localhost:3000")
            //            .AllowCredentials();
            //    });
            //});

        }
    }
}
