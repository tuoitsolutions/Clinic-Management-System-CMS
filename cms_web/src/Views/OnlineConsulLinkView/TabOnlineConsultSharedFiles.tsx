import { useTheme } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { FC, memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LinearLoadingProgress from "../../Component/LinearLoadingProgress";
import { InvalidDateTimeToDefault } from "../../Hooks/UseDateParser";
import { setPageSnackbar } from "../../Services/Actions/PageActions";
import ConsultRequestFileApi from "../../Services/Api/ConsultRequestFileApi";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import ConsultRequestFileEntity from "../../Services/Entities/ConsultRequestFileEntity";
import FileTabUi from "../../Styles/FileTabUi";

interface ITabOnlineConsultSharedFiles {
  consult_info: ConsultRequestEntity;
  handleSetSelectedFile?: (id: number) => void;
  reload_file: number;
}

const TabOnlineConsultSharedFiles: FC<ITabOnlineConsultSharedFiles> = memo(
  ({ consult_info, handleSetSelectedFile, reload_file }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [load_files, set_load_files] = useState(false);
    const [shared_files, set_shared_files] = useState<
      Array<ConsultRequestFileEntity>
    >([]);

    useEffect(() => {
      let mounted = true;
      const fetch_initial_data = async () => {
        set_load_files(true);
        const res = await ConsultRequestFileApi.GetAllFilesForConsult(
          consult_info.consult_req_pk
        );
        set_load_files(false);
        if (res.success) {
          set_shared_files(res.data);
        } else {
          dispatch(setPageSnackbar(res?.message?.toString(), "error"));
        }
      };

      mounted && !!consult_info?.consult_req_pk && fetch_initial_data();

      return () => {
        mounted = false;
      };
    }, [dispatch, consult_info, reload_file]);
    // GetAllFilesForConsult
    return (
      <>
        <FileTabUi theme={theme}>
          <div className="ctnr-title">
            <div className="main">Shared Files</div>
            <div className="sub">
              You can view and share files and/or documents in this consultation
              here.
            </div>
          </div>

          <div className="file-contents">
            <LinearLoadingProgress show={load_files} />
            {shared_files.length <= 0 && (
              <Alert severity="info">No file has been shared yet.</Alert>
            )}
            {shared_files?.map((r, i) => (
              <div
                className="file-item"
                key={i}
                onClick={() => handleSetSelectedFile(r.cr_file_pk)}
              >
                <div className="file-name">
                  {r.file_name}
                  {r.file_ext}
                </div>
                <div className="file-ts">
                  {InvalidDateTimeToDefault(r.encoded_at, "-")}
                </div>
              </div>
            ))}
          </div>
        </FileTabUi>
      </>
    );
  }
);

export default TabOnlineConsultSharedFiles;
