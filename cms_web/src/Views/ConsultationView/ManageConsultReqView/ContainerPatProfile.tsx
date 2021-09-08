import { Chip, Grid, IconButton } from "@material-ui/core";
import DuoRoundedIcon from "@material-ui/icons/DuoRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import React, { FC, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HelpNumber from "../../../Helpers/HelpNumber";
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
import { StringEmptyToDefault } from "../../../Hooks/UseStringFormatter";
import UseWindow from "../../../Hooks/UseWindow";
import ConsultRequestActions from "../../../Services/Actions/ConsultRequestActions";
import { setPageSnackbar } from "../../../Services/Actions/PageActions";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import { RootStore } from "../../../Services/Store";
import WriteDiagnosisDialog from "../../ResidentConsultRoomView/WriteDiagnosisDialog";
import ContainerConsultChat from "./ContainerConsultChat";
import ConsultProfilePic from "./ContainerConsultProfilePic";
interface IContainerPatProfile {
  consult_info: ConsultRequestEntity;
  successCallback: () => void;
}

const ContainerPatProfile: FC<IContainerPatProfile> = memo(
  ({ consult_info, successCallback }) => {
    const dispatch = useDispatch();

    const [open_write_diagnosis_dialog, set_open_write_diagnosis_dialog] =
      useState(false);

    return (
      <>
        <ConsultProfilePic />

        <div className="patient-profile-title">
          <div className="main">
            {consult_info?.prefix} {consult_info?.first_name}{" "}
            {consult_info?.middle_name} {consult_info?.last_name}{" "}
            {consult_info?.suffix}
          </div>
          <div className="sub">{consult_info?.consult_req_pk}</div>
          <Chip
            label={consult_info?.status?.sts_desc}
            style={{
              color: consult_info?.status?.sts_color,
              backgroundColor: consult_info?.status?.sts_bg_color,
            }}
          />
        </div>

        <div className="profile-actions">
          <Grid container spacing={1}>
            <Grid item>
              <ContainerConsultChat selected_row={consult_info} />
            </Grid>
            <Grid item>
              <IconButton
                color="primary"
                onClick={() => {
                  if (consult_info?.sts_pk === "s") {
                    UseWindow.PopupWindowCenter({
                      url: `/request/${consult_info?.hash_key}/consult-room`,
                      title: "consult-room",
                      w: 1360,
                      h: 768,
                    });
                  } else {
                    dispatch(
                      setPageSnackbar(
                        "You cannot attend to this consultation. It could be that the consultation has not started yet or it has already ended.",
                        "info"
                      )
                    );
                  }
                }}
              >
                <DuoRoundedIcon />
              </IconButton>
            </Grid>
          </Grid>
        </div>
        <div className="personal-info-ctnr">
          {/* <div className="info-group-column">
            <div className="label">Charity Patient</div>
            <div className="value">
              <Switch
                size="small"
                checked={consult_info?.is_charity === "y"}
                onChange={handleChangeCharityTag}
                color="primary"
              />
            </div>
          </div> */}
          <div className="info-group-column">
            <div className="label">Department</div>
            <div className="value">
              <span>
                {StringEmptyToDefault(
                  consult_info?.assign_dept_desc,
                  <em>To be decided</em>
                )}
              </span>
              {(consult_info?.sts_pk === "pd" ||
                consult_info.sts_pk === "fa") && (
                <span>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      dispatch(
                        ConsultRequestActions.SetOpenTransferDeptDialog(true)
                      );
                    }}
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              )}
            </div>
          </div>
          <div className="info-group-column">
            <div className="label">Resident</div>
            <div className="value">
              {StringEmptyToDefault(
                consult_info?.assign_res_desc,
                <em>To be decided</em>
              )}
            </div>
          </div>
          <div className="info-group-column">
            <div className="label">Starts At</div>
            <div className="value">
              <span>
                {InvalidDateTimeToDefault(
                  consult_info?.est_start_at,
                  <em>Not specified</em>
                )}
              </span>

              {(consult_info?.sts_pk === "pd" ||
                consult_info.sts_pk === "fa") && (
                <span>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      dispatch(ConsultRequestActions.SetOpenSchedDialog(true));
                    }}
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              )}
            </div>
          </div>
          <div className="info-group-column">
            <div className="label">Consult Fee</div>
            <div className="value">
              <Chip
                label={
                  <>
                    {consult_info.is_charity === "y" ? (
                      <em>Not applicable</em>
                    ) : (
                      <>
                        &#8369;{" "}
                        {HelpNumber.NumberToMoney(consult_info?.consult_cost)}
                      </>
                    )}
                  </>
                }
              />
              {/* <span>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {
                    dispatch(
                      ConsultRequestActions.SetOpenAdjustCostDialog(true)
                    );
                  }}
                >
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              </span> */}
            </div>
          </div>

          <div className="info-group-column">
            <div className="label">Hospital No.</div>
            <div className="value">
              <span>
                {StringEmptyToDefault(
                  consult_info?.hospital_no,
                  <em>To be decided</em>
                )}
              </span>
              {(consult_info?.sts_pk === "pd" ||
                consult_info.sts_pk === "fa" ||
                consult_info.sts_pk === "s" ||
                consult_info.sts_pk === "e") && (
                <span>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      dispatch(
                        ConsultRequestActions.SetOpenSyncPatDialog(true)
                      );
                    }}
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>{" "}
                  <span></span>{" "}
                </span>
              )}
            </div>
          </div>

          <div className="info-group-column">
            <div className="label">Adviced to Admit</div>
            <div className="value">
              <span>
                <Chip
                  label={consult_info?.is_advice_admit === "y" ? "Yes" : "No"}
                  color={
                    consult_info?.is_advice_admit === "y"
                      ? "primary"
                      : "secondary"
                  }
                />
              </span>
              {(consult_info.sts_pk === "s" || consult_info.sts_pk === "e") && (
                <span>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      set_open_write_diagnosis_dialog(true);
                    }}
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              )}
            </div>
          </div>

          <div className="info-group">
            <div className="label">
              <span>Diagnosis</span>
              {(consult_info.sts_pk === "s" || consult_info.sts_pk === "e") && (
                <span>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      set_open_write_diagnosis_dialog(true);
                    }}
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              )}
            </div>
            <div className="value">
              {StringEmptyToDefault(consult_info?.diagnosis, "To be decided")}
            </div>
          </div>
        </div>

        {open_write_diagnosis_dialog && !!consult_info && (
          <WriteDiagnosisDialog
            consult_info={consult_info}
            open_dialog={open_write_diagnosis_dialog}
            handleClose={() => set_open_write_diagnosis_dialog(false)}
            successCallback={successCallback}
          />
        )}
      </>
    );
  }
);

export default ContainerPatProfile;
