using cms_server.Entities;
using cms_server.Hooks;
using SelectPdf;
using Spire.Pdf;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;

namespace cms_server.Pdf
{
    public class MedCertPdf
    {
        public static Byte[] CreatePdf(string brand_name, string brand_logo, string brand_address, string brand_phone, string brand_email,
            ConsultRequestEntity consult_request, string qr_code, string resident_esignature_img
            )
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
                               Out-Patient Medical Certificate
                            </div>
                            <div class='divider'> </div>
                        </body>
                        </html>
                    ";


                string html_body =
                    $@"
                        <html>
                            <head>
                                <style>{css_instance} </style>
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
                                            {consult_request.line1}, {consult_request.psgcaddress} {consult_request.zip_code}
                                        </div>
                                    </div>
                                    <div class='qr'>
                                        <img src='data:image/png;base64,{qr_code}' />
                                    </div>
                                </div>

                                <div class='info-item info-title'>
                                    Patient Information
                                </div>

                                <div class='info-container'>
                                    <div class='req-info'>
                                        <div class='info-item  info-group'>
                                            <div class='value'>
                                                <b>
                                                    {consult_request.prefix} 
                                                    {consult_request.first_name} 
                                                    {consult_request.middle_name} 
                                                    {consult_request.last_name} 
                                                    {consult_request.suffix} / 
                                                    {consult_request.gender.ToUpper()} / 
                                                    {consult_request.birth_date:MMM, dd yyyy} ({consult_request.age})

                                                <b/>
                                            </div>
                                        </div>
                                        <div class='info-item  info-group'>
                                            <div class='label'>
                                                Code:
                                            </div>
                                            <div class='value'>
                                                <b>{consult_request.consult_req_pk}</b>
                                            </div>
                                        </div>

                                        <div class=' info-item  info-group'>
                                            <div class='label'>
                                                Address: 
                                            </div>
                                            <div class='value'>
                                                {consult_request.line1},
                                                {consult_request.citymundesc},
                                                {consult_request.provincedesc},
                                                {consult_request.regiondesc} 
                                                {consult_request.zip_code}
                                            </div>
                                        </div>
                                        <div class=' info-item  info-group'>
                                            <div class='label'>
                                                Prescribed On: 
                                            </div>
                                            <div class='value'>
                                                  {DateTime.Now:MMM, dd yyyy}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class='divider'> </div>
                                
                                <h3 style='margin-top: 5pt;'>To whom it may concern,</h3>

                                <div style='margin-top: 5pt; font-weight: 400; ' >
                                    <div>
                                      &#9; This is to certify that we have the records of
                                      <u><b>{consult_request.prefix} {consult_request.first_name} {consult_request.middle_name} {consult_request.last_name}{consult_request.suffix}</b></u>,
                                      <u><b>{consult_request.age}</b></u>
                                      year/s old,
                                      <u><b>{(consult_request.gender.Equals("m") ? "Male" : "Female")}</b></u>,
                                      <u><b>{consult_request.cs_desc}</b></u>, residing at
                                      <u><b>{consult_request.line1}, {consult_request.citymundesc},
                                        {consult_request.provincedesc}, {consult_request.regiondesc},
                                        {consult_request.zip_code},</b></u>
                                      was attended for consultation at
                                      <u><b>{brand_name}, {brand_address}</b></u>, date of consultation,
                                      <u><b>{consult_request.consult_at:MMM, dd yyyy hh:mm}</b></u>
                                      and found to have:
                                    </div>
                                    <div style='margin-left: 20pt'>
                                      <h3>Diagnosis</h3>
                                      <p style='margin-left: 20pt'>- {consult_request?.diagnosis}</p>
                                    </div>
                                    <br />    
                                </div>


                                <div class='grid' style='margin-top: 10em; justify-content: end; justify-self: end;'>
                                    <div  class='col-4' >
                                    </div>
                                    <div class='col-4' style='justify-content: end; justify-self: end;'>
                                         <div class='signature'>
                                             <div class='sign'>
                                                <img src='{resident_esignature_img}' height='80' /> 
                                             </div>                  
                                             <div class='name'>
                                                 <div>{consult_request.assigned_resident_info?.res_name}</div>
                                                 <div><small>Lic. No. {consult_request.assigned_resident_info?.license_no}</small></div>
                                             </div>             
                                         </div>
                                    </div>
                                </div>
                            </body>
                        </html>
                     ";

                string html_footer = "This is an electronically signed document | Page: {page_number} of {total_pages} | Issued At: " + DateTime.Now.ToString("MMM, dd, yyyy hh:mm tt");

                var doc = UsePdf.CreateStandardPdfDocument(html_header, html_body, html_footer);
                doc.Save(ms);
                res = ms.ToArray();

            }

            return res;
        }

    }
}
