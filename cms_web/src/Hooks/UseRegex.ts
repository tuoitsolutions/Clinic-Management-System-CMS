export const regex_image = /[\/.](gif|jpg|jpeg|tiff|jfif|png)$/i;
export const regex_pdf = /[\/.](pdf)$/i;
export const regex_doc = /[\/.](docx|ppt|pptx)$/i;

const GenerateFileType = (file_name: string): "img" | "pdf" | "doc" | "" => {
  if (regex_pdf.test(file_name)) {
    return "pdf";
  }

  if (regex_image.test(file_name)) {
    return "img";
  }

  if (regex_doc.test(file_name)) {
    return "doc";
  }

  return "";
};

export default {
  GenerateFileType,
};
