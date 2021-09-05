import { Button, Chip, Grid } from "@material-ui/core";
import React, { FC, memo, useState } from "react";
import HelpNumber from "../../../Helpers/HelpNumber";
import {
  InvalidDateTimeToDefault,
  InvalidDateToDefault,
} from "../../../Hooks/UseDateParser";
import { StringEmptyToDefault } from "../../../Hooks/UseStringFormatter";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import DialogUpdateConsultDtls from "./DialogUpdateConsultDtls";

interface ITabGeneralInfo {
  consult_info: ConsultRequestEntity;
  handleReloadRecord: () => void;
}

const TabGeneralInfo: FC<ITabGeneralInfo> = memo(
  ({ consult_info, handleReloadRecord }) => {
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
                    <div className="main">Patient Details</div>
                    <div className="sub">
                      The patient's personal and contact information in this
                      consultation.
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
                        Update Consult Dtls.
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className="info-group-column">
                  <div className="label">Prefix</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.prefix, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className="info-group-column">
                  <div className="label">First Name</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.first_name, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className="info-group-column">
                  <div className="label">Middle Name</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.middle_name, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className="info-group-column">
                  <div className="label">Last Name</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.last_name, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className="info-group-column">
                  <div className="label">Suffix</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.suffix, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className="info-group-column">
                  <div className="label">Gender</div>
                  <div className="value">
                    {consult_info?.gender === "m" && "Male"}
                    {consult_info?.gender === "f" && "Female"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className="info-group-column">
                  <div className="label">Birth Date</div>
                  <div className="value">
                    {InvalidDateToDefault(consult_info?.birth_date, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <div className="info-group-column">
                  <div className="label">Age</div>
                  <div className="value">{consult_info?.age}</div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <div className="info-group-column">
                  <div className="label">Nationality</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      consult_info?.nat_desc,
                      <em>Not specified</em>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className="info-group-column">
                  <div className="label">Civil Status</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      consult_info?.cs_desc,
                      <em>Not specified</em>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <div className="info-group-column">
                  <div className="label">Religion</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      consult_info?.rel_desc,
                      <em>Not specified</em>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <div className="info-group-column">
                  <div className="label">Mobile Number</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.mob_no, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} lg={6}>
                <div className="info-group-column">
                  <div className="label">Email Address</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.email, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info-group-column">
                  <div className="label">Complete Address</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.line1, "")}
                    {", "}
                    {StringEmptyToDefault(consult_info?.barangaydesc, "")}
                    {", "}
                    {StringEmptyToDefault(consult_info?.citymundesc, "")}
                    {", "}
                    {StringEmptyToDefault(consult_info?.provincedesc, "")}
                    {", "}
                    {StringEmptyToDefault(consult_info?.regiondesc, "")}
                    {", "}
                    {StringEmptyToDefault(consult_info?.zip_code, "")}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          {/* CONSULTATION INFO */}
          <Grid item xs={12}>
            <div className="ctnr-title-container">
              <Grid
                container
                spacing={0}
                alignContent="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <div className="ctnr-title">
                    <div className="main">Consultation Details</div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <div className="info-group-column">
                  <div className="label">Chief Complaint</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.chief_complaint, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="info-group-column">
                  <div className="label">Symptoms</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.symptoms, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="info-group-column">
                  <div className="label">Remarks</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.notes, "-")}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <div className="ctnr-title-container">
              <Grid
                container
                spacing={0}
                alignContent="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <div className="ctnr-title">
                    <div className="main">Consultation Status Timeline</div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className="info-group-column">
                  <div className="label">Requested On</div>
                  <div className="value">
                    {InvalidDateTimeToDefault(
                      consult_info?.request_at,
                      <em>To be decided</em>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info-group-column">
                  <div className="label">Paid On</div>
                  <div className="value">
                    {consult_info.is_charity === "y" ? (
                      <em>Not applicable</em>
                    ) : (
                      InvalidDateTimeToDefault(
                        consult_info?.pay_at,
                        <em>To be decided</em>
                      )
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info-group-column">
                  <div className="label">Started On</div>
                  <div className="value">
                    {InvalidDateTimeToDefault(
                      consult_info?.consult_at,
                      <em>To be decided</em>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info-group-column">
                  <div className="label">Ended On</div>
                  <div className="value">
                    {InvalidDateTimeToDefault(
                      consult_info?.ended_at,
                      <em>To be decided</em>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {!!consult_info?.consult_req_pk && open_edit_pat_details_dialog && (
          <DialogUpdateConsultDtls
            open={open_edit_pat_details_dialog}
            handleCloseDialog={() => {
              set_open_edit_pat_details_dialog(false);
            }}
            successCallback={() => {
              handleReloadRecord();
            }}
            consult_info={consult_info}
          />
        )}
      </>
    );
  }
);

export default TabGeneralInfo;
