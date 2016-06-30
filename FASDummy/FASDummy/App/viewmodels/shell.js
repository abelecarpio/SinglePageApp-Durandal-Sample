define(["durandal/system", "plugins/router"],
    function(system, router) {

        function activate() {

            router.on("router:route:not-found", function (fragment) {
                system.log("No routes found");
            });

            var routes = [
            { route: ["", "dashboard/default"], moduleId: "dashboard/default", title: "Dashboard", nav: false, hash: "#dashboard/default" },
            { route: "transaction/default", moduleId: "transaction/default", title: "Transaction", nav: true, hash: "#transaction/default" },
            ];

            //router.makeRelative({ moduleId: "viewModels" });
            //router.map(routes);
            //router.buildNavigationModel();
            //return router.activate({ pushState: true });

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