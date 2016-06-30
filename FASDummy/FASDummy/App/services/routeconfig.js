define(function() {
    
    function buildpath(ext) {
        return (($siteroot.match("^/")) ? $siteroot : $siteroot + "/") + ext;
    }

    var controllers = {
        transactionroute: buildpath("TransactionReversal/GetPrimeDetails")
    };
    return controllers;
});