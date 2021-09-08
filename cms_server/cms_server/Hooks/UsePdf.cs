using iTextSharp.text.pdf;
using SelectPdf;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace cms_server.Hooks
{
    public class UsePdf
    {
        public static SelectPdf.PdfDocument CreateStandardPdfDocument(string html_header, string html_body, string html_footer)
        {
            HtmlToPdf converter = new HtmlToPdf();
            converter.Options.PdfPageSize = PdfPageSize.A4;
            converter.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
            converter.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;
            converter.Options.MarginLeft = 108;
            converter.Options.MarginRight = 72;
            converter.Options.MarginTop = 72;
            converter.Options.MarginBottom = 72;

            //configure to show header
            converter.Options.DisplayHeader = true;
            converter.Header.DisplayOnFirstPage = true;
            converter.Header.DisplayOnOddPages = true;
            converter.Header.DisplayOnEvenPages = true;
            converter.Header.Height = 105;

            //configure to show footer
            converter.Options.DisplayFooter = true;
            converter.Footer.Height = 30;
            converter.Footer.DisplayOnFirstPage = true;
            converter.Footer.DisplayOnOddPages = true;
            converter.Footer.DisplayOnEvenPages = true;

            PdfHtmlSection header_sec = new PdfHtmlSection(html_header, "")
            {
                AutoFitWidth = HtmlToPdfPageFitMode.AutoFit,
                AutoFitHeight = HtmlToPdfPageFitMode.AutoFit
            };

            PdfTextSection pdf_page_numbers = new PdfTextSection(10, 10, html_footer, new System.Drawing.Font("Verdana", 5));
            pdf_page_numbers.HorizontalAlign = PdfTextHorizontalAlign.Right;

            converter.Header.Add(header_sec);
            converter.Footer.Add(pdf_page_numbers);

            return converter.ConvertHtmlString(html_body);
        }


        public static string AttachWatermarkImage(string base64_image, float watermark_opacity, byte[] pdf)
        {
            Bitmap watermark_bitmap = UseImage.BlurBase64Image(base64_image, watermark_opacity);
            MemoryStream pdf_stream;
            using (pdf_stream = new MemoryStream(10 * 1024))
            {
                using var reader = new PdfReader(pdf);
                using var stamper = new PdfStamper(reader, pdf_stream);
                int times = reader.NumberOfPages;
                for (int i = 1; i <= times; i++)
                {
                    var dc = stamper.GetOverContent(i);
                    using Bitmap b = new Bitmap(watermark_bitmap);
                    iTextSharp.text.Image savedImage = iTextSharp.text.Image.GetInstance(b, ImageFormat.Png);
                    savedImage.SetAbsolutePosition(0, 0); // set the position to bottom left corner of pdf
                    savedImage.ScaleAbsolute(iTextSharp.text.PageSize.A4.Width, iTextSharp.text.PageSize.A4.Height);
                    dc.AddImage(savedImage);
                }
            }
            return Convert.ToBase64String(pdf_stream.ToArray());
        }

    }
}
