define(["durandal/system", "plugins/router", "services/accountroutes"],
    function (system, router, accountroutes) {

        function activate() {
           
            //TODO: Check authentication in server

            


        }

        var shell = {
            activate: activate,
            router: router,
            showMenu: ko.observable(false)
        };

        shell.router.navigationModel.subscribe(function (val) {
            if (val.length > 1)
                shell.showMenu(true);
            else
                shell.showMenu(false);
        });
        return shell;





        function buildInitialAccess() {
            router.on("router:route:not-found", function (fragment) {
                logError("No Route Found or Access Denied", fragment, true);
            });

            //CHECK SESSION IF PRESENT IN SERVER THEN CONSTRUCT MENU ACCORDINGLY
            var routes = [];
            fasloginservice.GetSessionAccess()
                .done(function (result) {

                    if (result.responseCode !== 0) {
                        routes = [{ route: ["", "faslogin"], moduleId: "faslogin", title: "FAS | Login", nav: true, hash: "faslogin" }];
                        return router.makeRelative({ moduleId: "viewmodels" })
                            .map(routes)
                            .buildNavigationModel()
                            .activate({ pushState: true });
                    }
                    else {
                        //ALREADY AUTHENTICATED
                        routes = [
                            { route: ["", "home/default"], moduleId: "home/default", title: "Home", nav: true, hash: "#home/default" }
                        ];

                        //BUILD FROM SERVER
                        for (var index in result.routeMenu) {
                            if (result.routeMenu.hasOwnProperty(index)) {
                                var keyroute = result.routeMenu[index];
                                routes.push({ route: keyroute["Route"], moduleId: keyroute["ModuleId"], title: keyroute["Title"], nav: true, hash: keyroute["Hash"] });
                            }
                        }
                        router.deactivate();
                        router.reset();
                        router.routes = [];

                        router.on("router:route:not-found", function (fragment) {
                            logger.logError("No Route Found or Access Denied", null, null, true);
                        });
                        router.makeRelative({ moduleId: "viewmodels" });
                        router.map(routes);
                        router.buildNavigationModel();

                        return router.activate({ pushState: true });
                    }
                })
                .fail(function (result) {
                    logger.logError(result.responseMsg, null, title, true);

                    routes = [{ route: ["", "faslogin"], moduleId: "faslogin", title: "FAS | Login", nav: true, hash: "faslogin" }];
                    return router.makeRelative({ moduleId: "viewmodels" })
                          .map(routes)
                          .buildNavigationModel()
                          .activate({ pushState: true });
                });
        }
        

    });