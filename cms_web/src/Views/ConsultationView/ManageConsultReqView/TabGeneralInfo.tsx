import { Button, Chip, Grid } from "@material-ui/core";
import React, { FC, memo, useState } from "react";
import HelpNumber from "../../../Helpers/HelpNumber";
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
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
            <Grid container spacing={0}>
              <Grid item xs={12} sm={6} md={2} lg={1}>
                <div className="info-group">
                  <div className="label">Prefix</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.suffix, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <div className="info-group">
                  <div className="label">First Name</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.first_name, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <div className="info-group">
                  <div className="label">Middle Name</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.middle_name, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <div className="info-group">
                  <div className="label">Last Name</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.last_name, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={2} lg={1}>
                <div className="info-group">
                  <div className="label">Suffix</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.suffix, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <div className="info-group">
                  <div className="label">Mobile Number</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.mob_no, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <div className="info-group">
                  <div className="label">Email Address</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.email, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info-group">
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
            <Grid container spacing={0}>
              <Grid item xs={12} md={6} lg={2}>
                <div className="info-group">
                  <div className="label">Code</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.consult_req_pk, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={2} xl={1}>
                <div className="info-group">
                  <div className="label">Patient Number</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      consult_info?.hospital_no,
                      <em>To be decided</em>
                    )}
                    {/* <div>
                      {StringEmptyToDefault(
                        consult_info?.hospital_no,
                        <em>To be decided</em>
                      )}
                    </div> */}

                    {/* {consult_info?.sts_pk === "pd" && (
                      <Tooltip title="Map this consultation to a hospital number (Note: Only for patients that have admitted before)">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            // set_open_map_consult_dialog(true);
                          }}
                        >
                          <EditRoundedIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                    )} */}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={2} xl={1}>
                <div className="info-group">
                  <div className="label">Consult Cost</div>
                  <div className="value">
                    <Chip
                      label={
                        <>
                          {consult_info.is_charity === "y" ? (
                            <em>Not applicable</em>
                          ) : (
                            <>
                              {" "}
                              &#8369;{" "}
                              {HelpNumber.NumberToMoney(
                                consult_info?.consult_cost
                              )}{" "}
                            </>
                          )}
                        </>
                      }
                    />
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} md={6} lg={2}>
                <div className="info-group">
                  <div className="label">Department</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      consult_info?.assign_dept_desc,
                      <em>To be decided</em>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={2}>
                <div className="info-group">
                  <div className="label"> Resident</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      consult_info?.assign_res_desc,
                      <em>To be decided</em>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={2}>
                <div className="info-group">
                  <div className="label ">Expected Start On</div>
                  <div className="value">
                    {InvalidDateTimeToDefault(
                      consult_info?.est_start_at,
                      <em>To be decided</em>
                    )}
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} md={12}>
                <div className="info-group">
                  <div className="label">Chief Complaint</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.chief_complaint, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="info-group">
                  <div className="label">Symptoms</div>
                  <div className="value">
                    {StringEmptyToDefault(consult_info?.symptoms, "-")}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="info-group">
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
            <Grid container spacing={0}>
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
                    {InvalidDateTimeToDefault(
                      consult_info?.pay_at,
                      <em>To be decided</em>
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
