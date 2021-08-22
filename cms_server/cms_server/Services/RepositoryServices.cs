using DeliveryRoomWatcher.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace cms_web_api.Services
{
    public class RepositoryServices : IServices
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {

            //services.AddScoped<ISearchRepository, SearchRepository>();
            //services.AddScoped<IClientRepository, ClientRepository>();
            //services.AddScoped<IUserRepository, UserRepository>();
            //services.AddScoped<IClinicRepository, ClinicRepository>();
        }
    }
}
