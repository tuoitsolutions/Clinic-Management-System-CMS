using cms_server.Entities;
using cms_server.Hooks;
using SelectPdf;
using System;
using System.IO;

namespace cms_server.Pdf
{
    public class SoaPdf
    {
        public static Byte[] GenerateSoaPdf(string brand_name, string brand_logo, string brand_address, string brand_phone, string brand_email, ConsultRequestEntity consult_request, string qr_code)
        {

            Byte[] res = null;
            MemoryStream ms = null;

            using (ms = new MemoryStream())
            {
                string dir = Directory.GetCurrentDirectory();
                var path = dir + "\\Pdf\\pdf.css";

                string css_instance = File.ReadAllText(path);

                string html_header =
                    $@"
                        <html>
                        <head>
                            <style>
                                {css_instance}
                            </style>
                        </head>
                        <body>
                            <div class='header'>
                                <div class='brand-main-info'>
                                    <img src='data:image/png;base64,{brand_logo}' class='brand-logo' />
                                    <div class='brand-name'>
                                        {brand_name}
                                    </div>
                                </div>
                                <div class='brand-sub-info'>
                                    <div class='sub-info-item' style='margin-bottom: 10px;'>
                                        {brand_address}
                                    </div>
                                    <div class='sub-info-item'>
                                        Phone: {brand_phone}
                                    </div>
                                    <div class='sub-info-item'>
                                        Email Address: {brand_email}
                                    </div>
                                </div>
                            </div>
                            <div class='document-title'>
                                Statement of Account
                            </div>
                            <div class='divider'> </div>
                        </body>
                        </html>
                    ";

                string html_body =
                    $@"
                        <html>
                            <head>
                                <style>{css_instance}</style>
                            </head>
                            <body>
                                <div class='request-info-ctnr'>
                                    <div class='details'>
                                        <div class='name'>
                                            {consult_request.first_name} {consult_request.middle_name} {consult_request.last_name} {consult_request.suffix}
                                        </div>
                                        <div class='email'>
                                            {consult_request.email}
                                        </div>
                                        <div class='phone'>
                                            {consult_request.mob_no}
                                        </div>

                                        <div class='address'>
                                            {consult_request.line1},  {consult_request.psgcaddress} {consult_request.zip_code}
                                        </div>
                                    </div>
                                    <div class='qr'>
                                        <img src='data:image/png;base64,{qr_code}' />
                                    </div>
                                </div>

                                <div class='info-item info-title'>
                                    Consultation Details
                                </div>

                                <div class='info-container'>

                                    <div class='req-info'>
                                        <div class='info-item  info-group'>
                                            <div class='label'>
                                                Consult. Request Code:
                                            </div>
                                            <div class='value'>
                                                {consult_request.consult_req_pk}
                                            </div>
                                        </div>
                                        <div class=' info-item  info-group'>
                                            <div class='label'>
                                                Requested On:
                                            </div>
                                            <div class='value'>
                                                {consult_request.request_at}
                                            </div>
                                        </div>
                                        <div class=' info-item  info-group'>
                                            <div class='label'>
                                                Reason: 
                                            </div>
                                            <div class='value'>
                                                {consult_request.chief_complaint}
                                            </div>
                                        </div>
                                    </div>
                                    <div class='pay-info'>
                                        <div class=' info-item  info-group'>
                                            <div class='label'>
                                                Paid At:
                                            </div>
                                            <div class='value'>
                                                {consult_request.pay_at}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class='divider'> </div>

                                <div class='footer'>
                                    <div class='footer-info-group'>
                                        <div class='label'>Consultation Cost:  </div>
                                        <div class='value' style='color: green;'>
                                            &#8369;  {consult_request.consult_cost}
                                        </div>
                                    </div>
                                </div>
                            </body>
                        </html>
                     ";

                string html_footer = "Page: {page_number} of {total_pages} " +
                   "| Issued At: " + DateTime.Now.ToString("MMM, dd, yyyy hh:mm tt");



                PdfDocument doc = UsePdf.CreateStandardPdfDocument(html_header, html_body, html_footer);

                doc.Save(ms);
                res = ms.ToArray();
            }
            return res;
        }

    }
}
