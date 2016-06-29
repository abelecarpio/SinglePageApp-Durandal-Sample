using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FASDummy.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Default()
        {
            ViewBag.OtherServer = "Modify this template to jump-start your ASP.NET MVC application.";
            return View();
        }
    }
}
