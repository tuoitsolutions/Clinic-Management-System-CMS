using claim_form_server.Models;
using claim_form_server.Providers;
using claim_form_server.Repositories;
using DeliveryRoomWatcher.Repositories;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace claim_form_server.Hubs
{

    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class TimerHub : Hub
    {

        private readonly static ConnectionMapping<string> active_users =
                  new ConnectionMapping<string>();

        DefValRepo df = new DefValRepo();


        UserRepo _user = new UserRepo();

        private NotifyMaintenanceModel checkMaintenance()
        {
            DateTime maintenance_date = df.getCf4MaintenanceDateTime();

            var maintenance = new NotifyMaintenanceModel
            {
                will_maintenance = false,
                maintenance_datetime = null
            };

            maintenance.maintenance_datetime = maintenance_date;


            if (maintenance_date.Subtract(DateTime.Now).TotalSeconds >= 0)
            {
                maintenance.will_maintenance = true;
            }
            else
            {
                maintenance.will_maintenance = false;
            }

            return maintenance;
        }


        public async Task TriggerTimer()
        {
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveTimer", DateTime.Now);
        }

        public async Task AlertUpdateMessage()
        {
            var maintenance = checkMaintenance();
            if (maintenance.will_maintenance)
            {
                await Clients.AllExcept(active_users.GetConnections("pgh").ToList()).SendAsync("Maintenance", maintenance.maintenance_datetime);
            }
        }


        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "SignalR Users");


            var username = Context.User.Identity.Name;


            active_users.Add(username, Context.ConnectionId);

            //await Clients.Clients(active_users.GetConnections("pgh").ToList()).SendAsync("OnlineUsers", _user.getOnlineUsers(active_users.Users.ToList()));

            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveTimer", DateTime.Now);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {

            string name = Context.User.Identity.Name;
            active_users.Remove(name, Context.ConnectionId);

            //await Clients.Clients(active_users.GetConnections("pgh").ToList()).SendAsync("OnlineUsers", _user.getOnlineUsers(active_users.Users.ToList()));

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "SignalR Users");
            await base.OnDisconnectedAsync(exception);
        }



    }
}
