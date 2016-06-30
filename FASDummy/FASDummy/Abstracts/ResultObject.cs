using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Web.Mvc;
using System.Xml;
using System.Xml.Serialization;

namespace FASDummy.Abstracts
{
    public class ResultObject<T> : ActionResult
    {
        private static readonly UTF8Encoding Utf8 = new UTF8Encoding(false);

        public T Data { get; set; }

        public Type[] IncludedTypes = new[] { typeof(object) };

        public ResultObject(T data)
        {
            this.Data = data;
        }

        public ResultObject(T data, Type[] extraTypes)
        {
            this.Data = data;
            this.IncludedTypes = extraTypes;
        }


        public override void ExecuteResult(ControllerContext context)
        {
            if (context.HttpContext.Request.Headers["Content-Type"].Contains("application/json"))
            {
                new JsonResult { Data = this.Data }.ExecuteResult(context);
            }
            else
            {
                using (var stream = new MemoryStream(500))
                {
                    using (var xmlWriter = XmlWriter.Create(stream,
                        new XmlWriterSettings()
                        {
                            OmitXmlDeclaration = true,
                            Encoding = Utf8,
                            Indent = true
                        }))
                    {
                        new XmlSerializer(typeof(T), IncludedTypes)
                            .Serialize(xmlWriter, this.Data);
                    }

                    new ContentResult
                    {
                        ContentType = "text/xml",
                        Content = Utf8.GetString(stream.ToArray()),
                        ContentEncoding = Utf8
                    }.ExecuteResult(context);

                }
            }

        }
    }

    public class ReturnValue
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }
    }

    public class ReturnObject<T>
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }

        public T ReturnValue { get; set; }
    }


    public class ReturnObjectList<T>
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }

        public List<T> ReturnValueList { get; set; }
    }
    
}