import { Grid, IconButton, Tooltip } from "@material-ui/core";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { Skeleton } from "@material-ui/lab";
import React, { FC, memo, useState } from "react";
import { useDispatch } from "react-redux";
import { StringEmptyToDefault } from "../../Hooks/UseStringFormatter";

interface IContainerResAbout {}

const ContainerResAbout: FC<IContainerResAbout> = memo(() => {
  const [open_manage_notes_dialog, set_open_manage_notes_dialog] =
    useState(false);

  const dispatch = useDispatch();

  const [fetch_doctor_notes, set_fetch_doctor_notes] = useState(false);
  const [doctor_notes, set_doctor_notes] = useState("");

  //   const handleReloadDocNotes = useCallback(async () => {
  //     if (!!hash_key) {
  //       const response = await ConsultRequestApi.GetConsultDocNotes(hash_key);
  //       if (response.success) {
  //         set_doctor_notes(response.data);
  //       }
  //     }
  //   }, [hash_key]);

  //   useEffect(() => {
  //     let mounted = true;

  //     async function fetchData() {
  //       if (!!hash_key) {
  //         mounted && set_fetch_doctor_notes(true);

  //         const response = await ConsultRequestApi.GetConsultDocNotes(hash_key);

  //         if (response.success) {
  //           mounted && set_doctor_notes(response.data);
  //         }

  //         mounted && set_fetch_doctor_notes(false);
  //       }
  //     }

  //     mounted && fetchData();

  //     return () => {
  //       mounted = false;
  //     };
  //   }, []);
  return (
    <>
      <div className="panel-container notes">
        <div className="ctnr-title-container">
          <Grid container spacing={1} alignContent="center" alignItems="center">
            <Grid item xs={12} sm={6}>
              <div className="ctnr-title">
                <div className="main">About the doctor (Notes)</div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2} justify="flex-end">
                <Grid item>
                  <Tooltip title="Click to update the doctor notes">
                    <IconButton
                      color="primary"
                      style={{
                        backgroundColor: `#785ada1a`,
                      }}
                      onClick={() => {
                        // set_open_manage_notes_dialog(true);
                      }}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>

        <div className="content">
          {!!fetch_doctor_notes ? (
            <div
              style={{
                display: `grid`,
                gridGap: `.3em`,
                justifyContent: `center`,
                justifyItems: `center`,
              }}
            >
              <Skeleton
                variant="rect"
                width={260}
                animation="wave"
                height={10}
              />
              <Skeleton
                variant="rect"
                width={260}
                animation="wave"
                height={10}
              />
              <Skeleton
                variant="rect"
                width={260}
                animation="wave"
                height={10}
              />
              <Skeleton
                variant="rect"
                width={260}
                animation="wave"
                height={10}
              />
            </div>
          ) : (
            StringEmptyToDefault(
              doctor_notes,
              <em>No notes has been written yet.</em>
            )
          )}
        </div>
      </div>
    </>
  );
});

export default ContainerResAbout;
