define(["plugins/router", "durandal/system"],
    function(router, system) {
        
        function activate() {
            system.log("Dashboard has been activated.");
        };

        var title = "Dashboard To";
        var vmValue = {
            convertRouteToHash: router.convertRouteToHash,
            activate: activate,
            title: title
        };
        return vmValue;
    });