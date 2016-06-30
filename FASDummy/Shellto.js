define(['durandal/system', 'plugins/router', 'services/logger', 'models/appconfig', 'services/fasloginservice'],
    function (system, router, logger, config, fasloginservice) {
        var shell = {
            activate: Activate,
            router: router,
            menuclick: menuclickHandler,
            showMenu: ko.observable(false)
        };

        shell.router.navigationModel.subscribe(function (val) {
            if (val.length > 1)
                shell.showMenu(true);
            else
                shell.showMenu(false);

        });


        shell.showMenu.subscribe(function (val) {
            var routers = router.routes;

            var username = config.username;
            var day = moment(config.lastlogin).format('dddd');
            var lastlogin = config.lastlogin; //moment(config.lastlogin).format('MM/DD/YYYY');



            if (val == true) {
                for (x = 0 ; x < routers.length; x++) {
                    if (routers[x].route == "SystemSettings/SystemSettings") {
                        config.systemSettings(true);
                    }
                    if (routers[x].route == "EmailTemplateSettings/EmailTemplateSettings") {
                        config.emailTemplateSettings(true);
                    }

                    if (routers[x].route == "Holiday/HolidayMaker") {
                        config.holidayMaker(true);
                    }
                    if (routers[x].route == "Holiday/HolidayChecker") {
                        config.holidayChecker(true);
                    }
                    if (routers[x].route == "EmpowermentMatrix/Maker/index") {
                        config.empowermentMaker(true);
                    }
                    if (routers[x].route == "EmpowermentMatrix/Checker/index") {
                        config.empowermentChecker(true);
                    }
                    if (routers[x].route == "Maintenance/Elements/Prime") {
                        config.primeElement(true);
                    }
                    if (routers[x].route == "AnnualUsageProfitScoreUpload/Index") {
                        config.annualUsageUpload(true);
                    }
                    if (routers[x].route == "Maintenance/Elements/ProfitScoreUpload") {
                        config.profitScoreUpload(true);
                    }
                    if (routers[x].route == "FeeType/Maker/Index") {
                        config.feeTypeReversalReasonMaker(true);
                    }
                    if (routers[x].route == "FeeType/Checker/Index") {
                        config.feeTypeReversalReasonChecker(true);
                    }
                    if (routers[x].route == "CriteriaDefinition/Maker/Index") {
                        config.criteriaMaker(true);
                    }
                    if (routers[x].route == "CriteriaDefinition/Checker/Index") {
                        config.criteriaChecker(true);
                    }
                    if (routers[x].route == "TransactionReversal") {
                        config.manualReversal(true);
                    }
                    if (routers[x].route == "ReversalApproval/ReversalApproval") {
                        config.manualApproval(true);
                    }
                    if (routers[x].route == "BatchReversalApproval/BatchReversalApproval") {
                        config.batchApproval(true);
                    }
                    if (routers[x].route == "Inquiry/Inquiry") {
                        config.inquiry(true);
                    }
                    if (routers[x].route == "Inquiry/InquiryFASCardLink") {
                        config.inquiryFASCardLink(true);
                    }
                    if (routers[x].route == "Inquiry/InquiryFASLite") {
                        config.inquiryFASLite(true);
                    }
                    if (routers[x].route == "AuditTrailReport/AuditTrailReport") {
                        config.auditTrail(true);
                    }
                    if (routers[x].route == "AdjustmentReport/AdjustmentReport") {
                        config.adjustmentReport(true);
                    }
                    if (routers[x].route == "AdjustmentViaUploadReport/AdjustmentViaUploadReport") {
                        config.adjustmentViaUploadReport(true);
                    }
                    if (routers[x].route == "ExceptionReport/ExceptionReport") {
                        config.exceptionReport(true);
                    }
                    if (routers[x].route == "AdjustmentReport/AdjustmentHistoryReport") {
                        config.adjustmentHistoryReport(true);
                    }
                    if (routers[x].route == "AdjustmentReport/AccountAdjustmentReport") {
                        config.accountAdjustmentReport(true);
                    }
                    if (routers[x].route == "ReversalTransactionReport/ReversalTransactionReport") {
                        config.transactionReversalReport(true);
                    }
                }
            }

            fasloginservice.GetUsersLoginDetails()
                .done(function (result) {
                    var day = moment(result.lastlogin).format('dddd');
            var markup = $('<span/>', {
                        'text': 'Hi, ' + result.username + ' | ' + day + ' ' + result.lastlogin,
                'class': 'label label-primary'
            });
            markup.prepend(
                $('<span/>', {
                    'style': 'font-size: 12px; background-color: rgb(0, 91, 138);',
                })
                )
            $('#lastlogin').append(markup);

                })


        });

        return shell;

        function buildInitialAccess() {
           

            //CHECK SESSION IF PRESENT IN SERVER THEN CONSTRUCT MENU ACCORDINGLY
            var routes = [];
            fasloginservice.GetSessionAccess()
                .done(function (result) {

                    if (result.responseCode !== 0) {
                        routes = [{ route: ["", "FASLogin"], moduleId: "FASLogin", title: "Login", nav: true, hash: "FASLogin" }];

                        
                        router.on("router:route:not-found", function (fragment) {
                            //logger.logError("No Route Found or Access Denied", null, null, true);
                            //location.reload();
                            router.navigate('FASLogin');
                        });

                        router.makeRelative({ moduleId: "viewModels" });
                        router.map(routes);
                        router.buildNavigationModel();

                        if($siteroot == null || $siteroot === "/")
                            return router.activate({ pushState: true });
                        else
                            return router.activate({ pushState: true, root: "/" + $siteroot });

                        //if ($siteroot == null || $siteroot === "/")
                        //    return router.makeRelative({ moduleId: "viewModels" }).map(routes).buildNavigationModel().activate({ pushState: true });
                        //else
                        //    return router.makeRelative({ moduleId: "viewModels" }).map(routes).buildNavigationModel().activate({ pushState: true, root: "/" + $siteroot });


                    }
                    else {

                        var routers = result.routeMenu;
                        for (x = 0 ; x < routers.length; x++) {
                            if (routers[x].route == "SystemSettings/SystemSettings") {
                                config.systemSettings(true);
                            }
                            if (routers[x].route == "EmailTemplateSettings/EmailTemplateSettings") {
                                config.emailTemplateSettings(true);
                            }

                            if (routers[x].route == "Holiday/HolidayMaker") {
                                config.holidayMaker(true);
                            }
                            if (routers[x].route == "Holiday/HolidayChecker") {
                                config.holidayChecker(true);
                            }
                            if (routers[x].route == "EmpowermentMatrix/Maker/index") {
                                config.empowermentMaker(true);
                            }
                            if (routers[x].route == "EmpowermentMatrix/Checker/index") {
                                config.empowermentChecker(true);
                            }
                            if (routers[x].route == "Maintenance/Elements/Prime") {
                                config.primeElement(true);
                            }
                            if (routers[x].route == "AnnualUsageProfitScoreUpload/Index") {
                                config.annualUsageUpload(true);
                            }
                            if (routers[x].route == "Maintenance/Elements/ProfitScoreUpload") {
                                config.profitScoreUpload(true);
                            }
                            if (routers[x].route == "FeeType/Maker/Index") {
                                config.feeTypeReversalReasonMaker(true);
                            }
                            if (routers[x].route == "FeeType/Checker/Index") {
                                config.feeTypeReversalReasonChecker(true);
                            }
                            if (routers[x].route == "CriteriaDefinition/Maker/Index") {
                                config.criteriaMaker(true);
                            }
                            if (routers[x].route == "CriteriaDefinition/Checker/Index") {
                                config.criteriaChecker(true);
                            }
                            if (routers[x].route == "TransactionReversal") {
                                config.manualReversal(true);
                            }
                            if (routers[x].route == "ReversalApproval/ReversalApproval") {
                                config.manualApproval(true);
                            }
                            if (routers[x].route == "BatchReversalApproval/BatchReversalApproval") {
                                config.batchApproval(true);
                            }
                            if (routers[x].route == "Inquiry/Inquiry") {
                                config.inquiry(true);
                            }
                            if (routers[x].route == "Inquiry/InquiryFASCardLink") {
                                config.inquiryFASCardLink(true);
                            }
                            if (routers[x].route == "Inquiry/InquiryFASLite") {
                                config.inquiryFASLite(true);
                            }
                            if (routers[x].route == "AuditTrailReport/AuditTrailReport") {
                                config.auditTrail(true);
                            }
                            if (routers[x].route == "AdjustmentReport/AdjustmentReport") {
                                config.adjustmentReport(true);
                            }
                            if (routers[x].route == "AdjustmentViaUploadReport/AdjustmentViaUploadReport") {
                                config.adjustmentViaUploadReport(true);
                            }
                            if (routers[x].route == "ExceptionReport/ExceptionReport") {
                                config.exceptionReport(true);
                            }
                            if (routers[x].route == "AdjustmentReport/AdjustmentHistoryReport") {
                                config.adjustmentHistoryReport(true);
                            }
                            if (routers[x].route == "AdjustmentReport/AccountAdjustmentReport") {
                                config.accountAdjustmentReport(true);
                            }
                            if (routers[x].route == "ReversalTransactionReport/ReversalTransactionReport") {
                                config.transactionReversalReport(true);
                            }
                        }

                        var routes = [
                            { route: ["", "Home/Default"], moduleId: "Home/Default", title: "Home", nav: true, hash: "#Home/Default" }
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

                        router.on("router:route:not-found", function(fragment) {
                            logger.logError("No Route Found or Access Denied", null, null, true);
                            router.navigate("home/default");
                        });
                        router.makeRelative({ moduleId: "viewModels" });
                        router.map(routes);
                        router.buildNavigationModel();

                        if ($siteroot == null || $siteroot === "/")
                            return router.activate({ pushState: true });
                        else
                            return router.activate({ pushState: true, root: "/" + $siteroot });

                    }
                })
                .fail(function (result) {
                    logger.logError(result.responseMsg, null, "FAS Login", true);

                    routes = [{ route: ["", "FASLogin"], moduleId: "FASLogin", title: "FAS | Login", nav: true, hash: "FASLogin" }];
                    if($siteroot == null || $siteroot === "/")
                        return router.makeRelative({ moduleId: "viewModels" }).map(routes).buildNavigationModel().activate({ pushState: true });
                    else
                        return router.makeRelative({ moduleId: "viewModels" }).map(routes).buildNavigationModel().activate({ pushState: true, root: "/" + $siteroot });

                });

        }

        function Activate(){
            buildInitialAccess();

            
        }

        function log(msg, data, showToast){
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }

        function logError(msg, data, showToast){
            logger.logError(msg, data, system.getModuleId(shell), showToast);
        }

        function menuclickHandler(sender, e){
            e.preventDefault();
            e.stopPropagation();
            router.navigate(e.target.pathname);
        }

    });