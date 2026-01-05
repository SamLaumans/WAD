using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

[Authorize]
public class MessagesHub : Hub
{
    public async Task SendMessageToUser(string username, object message)
    {
        await Clients.User(username).SendAsync("ReceiveMessage", message);
    }

    public async Task BroadcastMessage(object message)
    {
        await Clients.All.SendAsync("ReceiveMessage", message);
    }
}
