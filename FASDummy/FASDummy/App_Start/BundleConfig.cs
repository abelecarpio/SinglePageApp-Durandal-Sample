using System;
using System.Web;
using System.Web.Optimization;

namespace FASDummy
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {

            //RESET BUNDLES CONFIG
            BundleTable.EnableOptimizations = true;
            bundles.IgnoreList.Clear();
            AddDefaultIgnorePatterns(bundles.IgnoreList);
            //END OF RESET BUNDLES CONFIG 


            bundles.Add(new ScriptBundle("~/bundles/jquery")
                .Include("~/Scripts/jquery-{version}.js")
                );

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/vendor")
                .Include("~/Scripts/bootstrap.js")
                .Include("~/Scripts/respond.js")
                .Include("~/Scripts/knockout-3.4.0.js")
                .Include("~/Scripts/knockout.mapping-latest.js")
                .Include("~/Scripts/jquery.signalR-2.2.0.min.js")
                );

            bundles.Add(new StyleBundle("~/Content/css")
                .Include("~/Content/bootstrap.css")
                .Include("~/Content/site.css")
                );
        }


        public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
        {
            if (ignoreList == null)
            {
                throw new ArgumentNullException("ignoreList");
            }
            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");
        }
    }
}