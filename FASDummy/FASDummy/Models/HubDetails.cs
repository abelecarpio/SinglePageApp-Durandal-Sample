using Microsoft.AspNet.SignalR.Client;

namespace FASDummy.Models
{
    public class HubDetails
    {

        public HubConnection SubConnection { get; set; }
        public IHubProxy SubProxy { get; set; }

    }
}