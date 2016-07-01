using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace FASDummy.Hubs
{
    [HubName("TransactionHub")]
    public class TransactionHub : Hub
    {
        public override Task OnConnected()
        {
            HubBridge.Instance.CheckForDisconnected();
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            TransactionHubShared.Instance.ReleaseTransaction(Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }

        //This will be called from other server
        public void LockThisTransaction(string cardNumber, string connectionId)
        {
            HubBridge.Instance.LockTransaction(connectionId, cardNumber);
            var message = $"Card Number : {cardNumber} has been locked to {connectionId}.";
            Clients.All.addActivity(message);
        }
        
        //This will be called from other server
        public void ReleaseThisTransaction(string cardNumber, string connectionId)
        {
            var wastedCardNumber = HubBridge.Instance.ReleaseTransaction(connectionId);
            HubBridge.Instance.NodeReleaseTransaction(connectionId, cardNumber);
            var message = $"Card Number : {cardNumber} has been release from {connectionId}.";
            Clients.All.addActivity(message);
        }


        //This should be called only in own client
        public void DisconnectMe(string connectionId)
        {
            var cardNumber = HubBridge.Instance.ReleaseTransaction(connectionId);
            if (string.IsNullOrEmpty(cardNumber)) return;
            ReleaseThisTransaction(cardNumber, connectionId);
        }
    }

    internal class TransactionHubShared
    {
        private static readonly Lazy<TransactionHubShared> LocalInstance =
          new Lazy<TransactionHubShared>(() => new TransactionHubShared(), LazyThreadSafetyMode.ExecutionAndPublication);

        public static readonly TransactionHubShared Instance = LocalInstance.Value;

        public void LockTransaction(string connectionId, string cardNumber)
        {
            HubBridge.Instance.NodeLockTransaction(connectionId, cardNumber);
            var message = $"Card Number : {cardNumber} has been locked to {connectionId}.";
            _hubContext.Clients.All.addActivity(message);
        }

        public void ReleaseTransaction(string connectionId)
        {
            var cardNumber = HubBridge.Instance.ReleaseTransaction(connectionId);
            HubBridge.Instance.NodeReleaseTransaction(connectionId, cardNumber);
            var message = $"Card Number : {cardNumber} has been release from {connectionId}.";
            _hubContext.Clients.All.addActivity(message);
        }

        private readonly IHubContext _hubContext = GlobalHost.ConnectionManager.GetHubContext<TransactionHub>();
    }

}