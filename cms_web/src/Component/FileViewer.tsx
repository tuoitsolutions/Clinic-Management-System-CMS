import { CircularProgress } from "@material-ui/core";
import WebViewer from "@pdftron/webviewer";
import React, { FC, memo, useEffect, useRef } from "react";
import { Base64toBlob } from "../Hooks/UseFileConverter";
interface IFileViewer {
  file: any;
  file_name?: string;
}

const FileViewer: FC<IFileViewer> = memo(({ file, file_name }) => {
  const viewer = useRef(null);

  useEffect(() => {
    if (file) {
      WebViewer(
        {
          // path: process.env.PUBLIC_URL + "/lib",
          path: "/lib",
          isReadOnly: true,
          // filename: file_name,
        },
        viewer.current
      ).then((instance: any) => {
        // const { docViewer } = instance;
        instance.loadDocument(Base64toBlob(file, "application/octet-stream"), {
          filename: file_name,
        });

        // instance.loadDocument(file, {
        //   filename: file_name,
        // });
      });
    }
  }, [file, file_name]);

  if (!file) {
    return null;
  }

  return (
    <div className="MyComponent">
      {file ? (
        <div
          className="webviewer"
          ref={viewer}
          style={{ height: "90vh", minWidth: `70vw` }}
        ></div>
      ) : (
        <div>
          Waiting for a file <CircularProgress />
        </div>
      )}
    </div>
  );
});

export default FileViewer;
