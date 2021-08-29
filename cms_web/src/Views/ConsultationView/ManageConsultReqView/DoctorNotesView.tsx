import { Grid, IconButton, Tooltip } from "@material-ui/core";
import React, { memo, FC, useState } from "react";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { useParams } from "react-router-dom";
import DialogUpdateDoctorNotes from "./DialogUpdateDoctorNotes";

interface IDoctorNotesView {}

const DoctorNotesView: FC<IDoctorNotesView> = memo(() => {
  const params = useParams();
  console.log(`params`, params);
  const [open_manage_notes_dialog, set_open_manage_notes_dialog] =
    useState(false);
  return (
    <>
      <div className="panel-container doctor-notes">
        <div className="ctnr-title-container">
          <Grid container spacing={1} alignContent="center" alignItems="center">
            <Grid item xs={12} sm={6}>
              <div className="ctnr-title">
                <div className="main">Doctor Notes</div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2} justify="flex-end">
                <Grid item>
                  <Tooltip title="Click to update the doctor notes">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        set_open_manage_notes_dialog(true);
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
          Knee pain, Headache, Last time he looked sick.
        </div>

        <DialogUpdateDoctorNotes
          open={open_manage_notes_dialog}
          handleCloseDialog={() => {
            set_open_manage_notes_dialog(false);
          }}
          hash_key={""}
          successCallback={() => {
            //reload
          }}
        />
      </div>
    </>
  );
});

export default DoctorNotesView;
