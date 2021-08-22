using SelectPdf;

namespace cms_server.Hooks
{
    public class UsePdf
    {
        public static PdfDocument CreateStandardPdfDocument(string html_header, string html_body, string html_footer)
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

            PdfDocument doc = converter.ConvertHtmlString(html_body);


            return doc;

        }
    }
}
