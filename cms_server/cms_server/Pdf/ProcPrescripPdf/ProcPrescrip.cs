using cms_server.Entities;
using cms_server.Hooks;
using SelectPdf;
using System;
using System.Collections.Generic;
using System.IO;

namespace cms_server.Pdf
{
    public class ProcPrescrip
    {
        public static Byte[] GenerateSoaPdf(string brand_name, string brand_logo, string brand_address, string brand_phone, string brand_email,
            ConsultRequestEntity consult_request, string qr_code,
            List<ConsultProcEntity> proc_prescrip, string resident_esignature_img
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
                               Procedure Request
                            </div>
                            <div class='divider'> </div>
                        </body>
                        </html>
                    ";


                string tbl_med_prescrip = "";

                foreach (var med in proc_prescrip)
                {
                    tbl_med_prescrip += $@"<tr>
                                                <td>
                                                    <div>{med.proc_desc}</div>
                                                    <small style='padding-top: 1pt;'><i>{med.notes}</i></small>
                                                </td>
                                          </tr>";
                }

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
                                
                                <table style='margin-top: 10pt'>
                                    <thead style='display: table-header-group;'>
                                        <tr>
                                            <td>
                                                Procedure Name
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tbl_med_prescrip}
                                    </tbody>
                                </table>


                                <div class='grid' style='margin-top: 10em; justify-content: end; justify-self: end;'>
                                    <div  class='col-4' >
                                    </div>
                                    <div class='col-4' style='justify-content: end; justify-self: end;'>
                                         <div class='signature'>
                                             <div class='sign'>
                                                <img src='{resident_esignature_img}' height='80' /> 
                                             </div>                  
                                             <div class='name'>
                                                 {consult_request.assign_res_desc}
                                             </div>             
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
