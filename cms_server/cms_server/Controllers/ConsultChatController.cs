using cms_server.Entities;
using cms_server.Hubs;
using cms_server.Interfaces;
using cms_server.Models;
using cms_server.Repositories;
using hrms_server.Payloads;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace cms_server.Controllers
{
    [Route("api/[controller]/[action]/{id?}")]
    [ApiController]
    public class ConsultChatController : ControllerBase
    {
        private readonly IHubContext<ChatHub, IChatHub> _chatHub;

        ConsultChatRepo chat_repo = new ConsultChatRepo();

        public ConsultChatController(IHubContext<ChatHub, IChatHub> chatHub)
        {
            _chatHub = chatHub;
        }

        [HttpPost]
        public async Task<IActionResult> JoinConsultChat(ChatModel payload)
        {
            await _chatHub.Groups.AddToGroupAsync(payload.connection_id, payload.consult_req_pk);
            //await _chatHub.Clients.Group(payload.consult_req_pk).GetConsultMessage();
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> LeaveConsultChat(ChatModel payload)
        {
            await _chatHub.Groups.RemoveFromGroupAsync(payload.connection_id, payload.consult_req_pk);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> InsertConsultChat([FromForm] ConsultReqChatEntity payload)
        {
            var response = chat_repo.InsertConsultChat(payload, User.Identity.Name);
            await _chatHub.Clients.Group(payload.consult_req_pk).GetConsultMessage();
            return Ok(response);
        }

        [HttpPost]
        public IActionResult GetConsultChat(SingleValuePayload payload)
        {
            return Ok(chat_repo.GetConsultChat(payload.value));
        }

    }
}
