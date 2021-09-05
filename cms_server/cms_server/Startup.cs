using claim_form_server.Hubs;
using cms_server.Hubs;
using ddt_server.Config;
using DeliveryRoomWatcher.Config;
using DeliveryRoomWatcher.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace DeliveryRoomWatcher
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            DatabaseConfig.conStr = configuration.GetConnectionString("MysqlConnection");

            DefaultConfig.app_name = Configuration["DEFAULTS:app_name"];

            DefaultConfig.ftp_ip = Configuration["FTP:ip"];
            DefaultConfig.ftp_user = Configuration["FTP:user"];
            DefaultConfig.ftp_pass = Configuration["FTP:pass"];

            DefaultConfig.paymongo_secret_key = Configuration["PAY:paymongo_secret_key"];
            DefaultConfig.paymongo_public_key = Configuration["PAY:paymongo_public_key"];
            DefaultConfig.paymongo_payment_url = Configuration["PAY:paymongo_payment_url"];
            DefaultConfig.paymongo_source_url = Configuration["PAY:paymongo_source_url"];
            DefaultConfig.paymongo_pay_intent_url = Configuration["PAY:paymongo_pay_intent_url"];


            DefaultConfig._providerEmailAddress = Configuration["EMAIL:_providerEmailAddress"];
            DefaultConfig._providerEmailPass = Configuration["EMAIL:_providerEmailPass"];
            DefaultConfig._clientBaseUrl = Configuration["EMAIL:_clientBaseUrl"];
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.InstallServicesInAssembly(Configuration);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors("AllowAll");

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                //endpoints.MapHub<TimerHub>("/api/hubs/timer");
                endpoints.MapHub<ChatHub>("/api/hubs/chat");
            });

        }


    }
}
