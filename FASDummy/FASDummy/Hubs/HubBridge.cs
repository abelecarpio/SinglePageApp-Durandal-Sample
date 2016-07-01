using FASDummy.Models;
using Microsoft.AspNet.SignalR.Client;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;

namespace FASDummy.Hubs
{
    public sealed class HubBridge
    {
        internal static ConcurrentDictionary<string, string> ActiveTransactions => _activeTransactions ?? (_activeTransactions = new ConcurrentDictionary<string, string>());


        private static ConcurrentDictionary<string, string> _activeTransactions;

        private HubBridge()
        {
            _activeTransactions = new ConcurrentDictionary<string, string>();
            OtherServers = new ConcurrentDictionary<string, HubDetails>();
        }

        internal void LockTransaction(string connectionId, string cardNumber)
        {
            _activeTransactions.TryAdd(connectionId, cardNumber);
        }

        internal string ReleaseTransaction(string connectionId)
        {
            string returnValue;
            _activeTransactions.TryRemove(connectionId, out returnValue);
            return returnValue;
        }

        internal void NodeLockTransaction(string connectionId, string cardNumber)
        {
            _activeTransactions.TryAdd(connectionId, cardNumber);
            foreach (var otherServer in OtherServers)
            {
                if (otherServer.Value.SubConnection.State != ConnectionState.Connected) continue;
                otherServer.Value.SubProxy.Invoke("LockThisTransaction", cardNumber, connectionId);
            }
        }

        internal void NodeReleaseTransaction(string connectionId, string cardNumber)
        {
            if (string.IsNullOrEmpty(connectionId) || string.IsNullOrEmpty(cardNumber)) return;
            foreach (var otherServer in OtherServers)
            {
                if (otherServer.Value.SubConnection.State != ConnectionState.Connected) continue;
                otherServer.Value.SubProxy.Invoke("ReleaseThisTransaction", cardNumber, connectionId);
            }
        }

        internal void SetUpConnection()
        {
            if (OtherServers.Count == NodeServerCount) return;
            var allkeys = ConfigurationManager.AppSettings.AllKeys.Where(x => x.StartsWith("NodeServer"));
            var nodeservers = allkeys as IList<string> ?? allkeys.ToList();
            if (nodeservers.Count < 1) return;

            //clean up proxies
            foreach (var hubConnection in OtherServers)
            {
                if (nodeservers.Any(x => string.Equals(x, hubConnection.Key, StringComparison.InvariantCultureIgnoreCase))) return;
                HubDetails wastedConnection;
                OtherServers.TryRemove(hubConnection.Key, out wastedConnection);
            }
           
            foreach (var configkey in nodeservers)
            {
                var baseurl = ConfigurationManager.AppSettings[configkey] ?? string.Empty;
                if (string.IsNullOrEmpty(baseurl)) continue;
                baseurl = baseurl.Trim().EndsWith("/") ? baseurl.Trim() : baseurl.Trim() + "/";
                if (OtherServers.Any(x => string.Equals(x.Key, baseurl, StringComparison.InvariantCultureIgnoreCase))) return;

                var nodeconnect = new HubConnection(baseurl);

                try
                {
                    OtherServers.TryAdd(baseurl,
                        new HubDetails()
                        {
                            SubConnection = nodeconnect,
                            SubProxy = nodeconnect.CreateHubProxy("TransactionHub")
                        });
                    var proxy =
                        OtherServers.FirstOrDefault(
                            x => string.Equals(x.Key, baseurl, StringComparison.InvariantCultureIgnoreCase));
                    proxy.Value.SubConnection.Start().Wait();
                }
                catch (Exception) {}
            }
        }

        internal void CheckForDisconnected()
        {
            foreach (var otherServer in OtherServers)
            {
                if (otherServer.Value.SubConnection.State == ConnectionState.Connected) continue;
                try
                {
                    otherServer.Value.SubConnection.Start().Wait();
                }
                catch (Exception){}
            }
        }

        #region PROPERTIES

        internal int NodeServerCount
        {
            get
            {
                var appkey = ConfigurationManager.AppSettings.AllKeys;
                var servers = appkey.Where(x => x.StartsWith("NodeServer"));
                return servers.Count();
            }
        }

        public static HubBridge Instance
        {
            get
            {
                if (HubBridge._instance != null) return HubBridge._instance;
                lock (Padlock)
                {
                    if (HubBridge._instance != null) return HubBridge._instance;
                    var newInstance = new HubBridge();
                    System.Threading.Thread.MemoryBarrier();
                    HubBridge._instance = newInstance;
                }
                return HubBridge._instance;
            }
        }

        private static HubBridge _instance = null;

        private static readonly object Padlock = new object();

        private ConcurrentDictionary<string, HubDetails> OtherServers { get; set; }
        
        #endregion PROPERTIES
    }
}