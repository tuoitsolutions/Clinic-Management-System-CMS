import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useState } from "react";
import { StringEmptyToDefault } from "../../Hooks/UseStringFormatter";
import HospResidentEntity from "../../Services/Entities/HospResidentEntity";
import DialogResESignUpdate from "./ContainerEsign";

interface ITabResProfGeneralInfo {
  resident_info: HospResidentEntity;
  handleReloadRecord: () => void;
}

const TabResProfGeneralInfo: FC<ITabResProfGeneralInfo> = memo(
  ({ resident_info, handleReloadRecord }) => {
    const [open_edit_pat_details_dialog, set_open_edit_pat_details_dialog] =
      useState(false);

    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className="ctnr-title-container">
              <Grid
                container
                spacing={0}
                alignContent="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={6}>
                  <div className="ctnr-title">
                    <div className="main">Personal Details</div>
                    <div className="sub">
                      These are your personal and contact information.
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={2} justify="flex-end">
                    <Grid item>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          set_open_edit_pat_details_dialog(true);
                        }}
                      >
                        Update Personal Dtls
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={6} md={2} lg={1}>
                <div className="info-group">
                  <div className="label">Prefix</div>
                  <div className="value">
                    {StringEmptyToDefault(resident_info?.suffix, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <div className="info-group">
                  <div className="label">First Name</div>
                  <div className="value">
                    {StringEmptyToDefault(resident_info?.first_name, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <div className="info-group">
                  <div className="label">Middle Name</div>
                  <div className="value">
                    {StringEmptyToDefault(resident_info?.middle_name, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <div className="info-group">
                  <div className="label">Last Name</div>
                  <div className="value">
                    {StringEmptyToDefault(resident_info?.last_name, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={2} lg={1}>
                <div className="info-group">
                  <div className="label">Suffix</div>
                  <div className="value">
                    {StringEmptyToDefault(resident_info?.suffix, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={2} lg={1}>
                <div className="info-group">
                  <div className="label">Title</div>
                  <div className="value">
                    {StringEmptyToDefault(resident_info?.doc_title, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <div className="info-group">
                  <div className="label">Mobile Number</div>
                  <div className="value">
                    {StringEmptyToDefault(resident_info?.mob_no, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <div className="info-group">
                  <div className="label">Email Address</div>
                  <div className="value">
                    {StringEmptyToDefault(resident_info?.email, "-")}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          {/* CONSULTATION INFO */}
          <DialogResESignUpdate />
        </Grid>
      </>
    );
  }
);

export default TabResProfGeneralInfo;
