// Maps the files so Durandal knows where to find these.
require.config({
    baseUrl: "/App",
    paths: {
        'text': "../Scripts/text",
        'durandal': "../Scripts/durandal",
        'plugins': "../Scripts/durandal/plugins",
        'transitions': "../Scripts/durandal/transitions",
        'viewmodels': "../App/viewModels",
        'views': "../App/views",
        'models': "../App/models"
    }
});

// Durandal 2.x assumes no global libraries. It will ship expecting 
// Knockout and jQuery to be defined with requirejs. .NET 
// templates by default will set them up as standard script
// libs and then register them with require as follows: 
define("jquery", function() {
    return jQuery;
});
define("knockout", function() {
    return ko;
});

define(["durandal/app", "durandal/viewLocator", "durandal/system", "plugins/widget", "plugins/router", "plugins/dialog", "durandal/viewEngine", "services/logger"], boot);

function boot(app, viewLocator, system, widget, router, dialog, viewEngine, logger) {

    // Enable debug message to show in the console 
    system.debug(true);

    app.title = "Financial Adjustment System";

    //specify which plugins to install and their configuration
    app.configurePlugins({
        router: true,
        dialog: true,
        widget: true
    });

    dialog.MessageBox.setDefaults({ buttonClass: "btn", primaryButtonClass: "btn-primary", secondaryButtonClass: "btn-danger" });

    widget.registerKind("searcher");
    widget.registerKind("uploader");

    app.start().then(function() {

        ////Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention("viewModels", "views", "views");

        //Show the app by setting the root view model for our application.
        app.setRoot("viewModels/Shell", "entrance");

    });

};