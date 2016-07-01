define(["durandal/system", "plugins/router"],
    function(system, router) {

        function activate() {

            router.on("router:route:not-found", function (fragment) {
                system.log("No routes found");
            });

            var routes = [
            { route: ["", "Dashboard/default"], moduleId: "Dashboard/default", title: "Dashboard", nav: true, hash: "#Dashboard/default" },
            { route: "Transaction/default", moduleId: "Transaction/default", title: "Transaction", nav: true, hash: "#Transaction/default" },
            ];

            if ($siteroot == null || $siteroot === "/")
                return router.makeRelative({ moduleId: "viewmodels" }).map(routes).buildNavigationModel().activate({ pushState: true });
            else
                return router.makeRelative({ moduleId: "viewmodels" }).map(routes).buildNavigationModel().activate({ pushState: true, root: "/" + $siteroot });
        };


        var shell = {
            activate: activate,
            router: router
        };

        return shell;
    });