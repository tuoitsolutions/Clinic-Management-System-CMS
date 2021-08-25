using claim_form_server.Providers;
using cms_server.Interfaces;
using cms_server.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace cms_server.Hubs
{
    public class ChatHub : Hub<IChatHub>
    {
        private readonly static ConnectionMapping<string> rooms =
                 new ConnectionMapping<string>();

        public override async Task OnConnectedAsync()
        {
            //await Groups.AddToGroupAsync(Context.ConnectionId, "SignalR Users");

            //var username = Context.User.Identity.Name;
            //rooms.Add(username, Context.ConnectionId);
            await Clients.All.Connected();
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            //await Groups.RemoveFromGroupAsync(Context.ConnectionId, "SignalR Users");
            await Clients.All.Disconnected();
            await base.OnDisconnectedAsync(exception);
        }

    }
}
