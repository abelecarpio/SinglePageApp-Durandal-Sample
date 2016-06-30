using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FASDummy.Abstracts;
using FASDummy.Hubs;

namespace FASDummy.Controllers
{
    public class TransactionReversalController : Controller
    {
        //
        // GET: /TransactionReversal/
        
        [HttpPost]
        public ActionResult GetPrimeDetails(string cardNumber, string connectionId)
        {
            var returnValue = new ResultObject<ReturnObject<string>>(new ReturnObject<string> { IsSuccess = false, ErrorMessage = "Unable to connect to server." });
            try
            {
                var oldtransaction = HubBridge.ActiveTransactions.Where(x => x.Key == connectionId && x.Value != cardNumber);
                foreach (var keyValuePair in oldtransaction)
                {
                    TransactionHubShared.Instance.ReleaseTransaction(keyValuePair.Key);
                }
                
                if (HubBridge.ActiveTransactions.Any(x => x.Key != connectionId && x.Value == cardNumber))
                    throw new Exception("Card Number is already lock");

                if (!HubBridge.ActiveTransactions.Any(x => x.Key == connectionId && x.Value == cardNumber))
                {
                    TransactionHubShared.Instance.LockTransaction(connectionId, cardNumber);
                }
                returnValue.Data.IsSuccess = true;
            }
            catch (Exception ex){returnValue.Data.ErrorMessage = ex.ToString();}
            return returnValue;
        }

    }
}
