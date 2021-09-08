using cms_server.Entities;
using cms_server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Interfaces
{
    public interface IChatHub
    {
        Task GetConsultMessage();
        Task Connected();
        Task Disconnected();
    }
}
