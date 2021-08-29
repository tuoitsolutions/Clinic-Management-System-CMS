export const fileToBase64 = (blob: Blob): Promise<string | null> =>
  new Promise((resolve, reject) => {
    if (!blob) {
      return resolve(null);
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(blob);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        return resolve(btoa(reader.result));
      }
    };

    reader.onerror = (error: any) => {
      return resolve(null);
    };
  });

export const Base64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export const dataURLtoFile = (data_url, filename) => {
  data_url = "data:application/octet-stream;base64, " + data_url;
  var arr = data_url.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  const converted_file = new File([u8arr], filename, { type: mime });

  return converted_file;
};

export const dataURLtoImageFile = (data_url, filename) => {
  if (!!data_url && !!filename) {
    try {
      data_url = "data:image/png;base64, " + data_url;

      var arr = data_url.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const converted_file = new File([u8arr], filename, { type: mime });
      return converted_file;
    } catch (error) {
      return null;
    }
  }
  return null;
};

// export async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {

//   const res: Response = await fetch(dataUrl);
//   const blob: Blob = await res.blob();
//   return new File([blob], fileName, { type: 'image/png' });
// }
