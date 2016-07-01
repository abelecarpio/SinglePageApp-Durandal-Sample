// Maps the files so Durandal knows where to find these.
require.config({
    baseUrl: '/App',
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
        //,'viewmodels': '../App/viewmodels',
        //'views': '../App/views',
        //'models': '../App/models'
    }
});

// Durandal 2.x assumes no global libraries. It will ship expecting 
// Knockout and jQuery to be defined with requirejs. .NET 
// templates by default will set them up as standard script
// libs and then register them with require as follows: 
define("jquery", function () { return jQuery; });
define("knockout", function () { return ko; });


define(["durandal/app", "durandal/viewLocator", "durandal/system", "plugins/router", "durandal/viewEngine"], boot);
function boot(app, viewLocator, system, router, viewEngine) {

    // Enable debug message to show in the console 
    system.debug(true);

    app.title = "FAS Dummy";

    //specify which plugins to install and their configuration
    app.configurePlugins({
        router: true,
        dialog: true,
        widget: {
            kinds: ['expander']
        }
    });
    
    app.start().then(function () {
        ////Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention("viewmodels", "views", "views");

        //Show the app by setting the root view model for our application.
        app.setRoot("viewmodels/shell", "entrance");
    });
};
