import { Backdrop, IconButton, useTheme } from "@material-ui/core";
import BackspaceRoundedIcon from "@material-ui/icons/BackspaceRounded";
import PictureAsPdfRoundedIcon from "@material-ui/icons/PictureAsPdfRounded";
import ZoomInRoundedIcon from "@material-ui/icons/ZoomInRounded";
import ZoomOutRoundedIcon from "@material-ui/icons/ZoomOutRounded";
import React, { FC, memo, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styled from "styled-components";
import UseRegex from "../Hooks/UseRegex";
import FileViewer from "./FileViewer";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface IPreviewPDF {
  file: any;
  handleClose?: () => void;
  doc_title: string;
  actions?: any;
  type?: "img" | "pdf" | "doc" | "";
}

const PreviewPDF: FC<IPreviewPDF> = memo(
  ({ file, handleClose, doc_title, type, actions }) => {
    const theme = useTheme();
    const [numPages, setNumPages] = useState(null);

    const file_type: "img" | "pdf" | "doc" | "" =
      UseRegex.GenerateFileType(doc_title);

    const [scale, set_scale] = useState(1.5);

    function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
    }

    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);

    return (
      <div>
        <StyledPdfPreview theme={theme} open={true}>
          <div className="header">
            <div className="start">
              <div className="start-item">
                <IconButton
                  onClick={() => {
                    if (typeof handleClose === "function") {
                      handleClose();
                    }
                  }}
                >
                  <BackspaceRoundedIcon />
                </IconButton>
              </div>
              <div className="start-item"></div>
              <div className="start-item doc-title">{doc_title}</div>
            </div>
            <div className="center"></div>
            <div className="end">{actions}</div>
          </div>

          <div
            className="document"
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          >
            {(file_type === "img" || type === "img") && (
              <img alt="" src={`data:image/png;base64, ${file}`} />
            )}

            {(file_type === "pdf" || type === "pdf") && (
              <Document
                file={`data:application/pdf;base64, ${file}`}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {Array.apply(null, { length: numPages }).map((p, i) => (
                  <Page
                    key={`pdf` + i}
                    scale={scale}
                    pageNumber={i + 1}
                    className="page-item"
                  />
                ))}
              </Document>
            )}

            {(file_type === "doc" || type === "doc") && (
              <FileViewer file={file} file_name={doc_title} />
            )}
          </div>
          {(file_type === "img" || file_type === "pdf") && (
            <div className="footer">
              <div className="footer-content">
                <div className="pages"># of pages: {numPages}</div>
                <div className="actions">
                  <div className="action-item">
                    <IconButton
                      disabled={scale === 1}
                      onClick={() => {
                        set_scale((s) => {
                          if (s > 1) {
                            s = s - 0.1;
                          }
                          return s;
                        });
                      }}
                    >
                      <ZoomOutRoundedIcon />
                    </IconButton>
                    <IconButton
                      disabled={scale === 2.5}
                      onClick={() => {
                        set_scale((s) => {
                          if (s < 2.5) {
                            s = s + 0.1;
                          }
                          return s;
                        });
                      }}
                    >
                      <ZoomInRoundedIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </StyledPdfPreview>
      </div>
    );
  }
);

export default PreviewPDF;

const StyledPdfPreview = styled(Backdrop)`
  .page-item {
    margin-bottom: 1.5em;
  }
  &.MuiBackdrop-root {
    z-index: ${(p) => p.theme.zIndex.drawer + 2};
    min-width: 100vw;
    min-height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.85);
    .MuiIconButton-root {
      color: #fff;
      /* background-color: blue; */
    }

    .header {
      position: sticky;
      top: 0;
      color: #fff !important;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr 1fr 1fr;
      padding: 1em;
      background-color: rgba(0, 0, 0, 0.1);
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
      align-items: center;
      align-content: center;
      .start {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        align-content: center;
        justify-content: start;
        grid-gap: 0.5em;
        font-weight: 600;
        text-shadow: 1px 1px 1px black;

        .doc-title {
          background-color: rgba(0, 0, 0, 0.2);
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.2);
          border-radius: 20px;
          /* padding: 0.5em 0; */
        }
      }

      .center {
      }

      .end {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        align-content: center;
        justify-content: end;
      }
    }
    .document {
      right: 30;
      display: grid;
      justify-content: center;
      justify-items: center;

      .react-pdf__Page {
        position: inherit !important;
      }
    }

    .footer {
      color: #fff;
      border-radius: 7px;
      grid-auto-flow: column;
      position: fixed;
      bottom: 0;
      margin-bottom: 1em;
      right: auto;
      left: auto;
      background-color: rgba(0, 0, 0, 0.65);

      left: 50%;

      transform: translate(-50%, 0);
      padding: 0.3em 3em;

      .footer-content {
        /* display: grid !important; */
        /* align-items: center !important;
        align-content: center !important;
        justify-items: center !important;
        justify-content: center !important; */
        /* min-width: 400px !important; */
        /* grid-auto-flow: column !important;
        grid-auto-columns: 1fr 1fr;
        grid-gap: 1em !important; */
        .pages {
          font-weight: 500;
          display: grid;
          justify-self: start;
          justify-content: start;
          align-self: start;
          align-content: start;
        }

        .actions {
          justify-self: end;
          grid-auto-flow: column;
          display: grid;
          justify-self: end;
          justify-content: end;
          grid-gap: 0.5em;
        }
      }
    }
  }
`;
