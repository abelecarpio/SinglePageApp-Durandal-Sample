define(["services/routeconfig"],
    function (routerconfig) {
        var route = {};

        route.getinformation = function (data) {
            return $.ajax({
                url: routerconfig.transactionroute,
                contentType: "application/json",
                type: "POST",
                data: JSON.stringify(data)
            });
        }

        return route;
    });