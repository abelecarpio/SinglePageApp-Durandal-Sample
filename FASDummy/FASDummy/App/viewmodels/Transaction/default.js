define(["plugins/router", "durandal/system", "services/transactionroutes"],
    function (router, system, transactionroutes) {
        var messages = ko.observableArray();
        var localcardnumber = ko.observable("");
        var connectionId = "";

        $.connection.TransactionHub.logging = true;
        var hubclient = $.connection.TransactionHub;
        hubclient.client.addActivity = function (message) {
            messages.push(message);
        }

        $.connection.hub.start().done(function() {
            connectionId = $.connection.hub.id;
        });


        function activate() {
            system.log("Transaction has been activated.");
        };

        function ondeactivate() {
            hubclient.server.disconnectMe(connectionId);
        }

        function getinformation() {
            var payload = { "cardNumber": localcardnumber(), "connectionId": connectionId };
            transactionroutes.getinformation(payload)
            .done(function (result) {
                //alert("done");
            })
            .fail(function () {
                //alert("fail");
            })
            .complete(function () {
                //alert("complete");
            });
        }
        
        var title = "Transaction To";
        var vmValue = {
            convertRouteToHash: router.convertRouteToHash,
            activate: activate,
            deactivate: ondeactivate,
            title: title,
            cardnumber: localcardnumber,
            getinfo: getinformation,
            logmessages: messages
        };
        return vmValue;
    });