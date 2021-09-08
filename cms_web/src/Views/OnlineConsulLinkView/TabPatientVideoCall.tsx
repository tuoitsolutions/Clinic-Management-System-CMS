import { Chip, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { FC, memo } from "react";
import BodyLoader from "../../Component/BodyLoader";
import { StringEmptyToDefault } from "../../Hooks/UseStringFormatter";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import { Jutsu } from "react-jutsu";
import { useSelector } from "react-redux";
import {
  InvalidDateTimeToDefault,
  InvalidDateToDefault,
} from "../../Hooks/UseDateParser";
import { RootStore } from "../../Services/Store";
import VideoCallUi from "../../Styles/VideoCallUi";
import { useParams } from "react-router";
interface ITabPatientVideoCall {
  consult_info: ConsultRequestEntity;
}

const TabPatientVideoCall: FC<ITabPatientVideoCall> = memo(
  ({ consult_info }) => {
    const user = useSelector((store: RootStore) => store.UserReducer.user);
    const { hash_key } = useParams();
    return (
      <>
        <VideoCallUi>
          <div className="video">
            <iframe
              title="iframe-video"
              allow="camera; microphone; fullscreen; display-capture"
              src={`https://meet.jit.si/${
                hash_key + consult_info?.consult_link_hash
              }#jitsi_meet_external_api_id=0&config.startWithVideoMuted=true&config.subject="${
                consult_info.consult_req_pk
              }"&config.startWithAudioMuted=true&config.enableWelcomePage=false&config.disableDeepLinking=true&config.prejoinPageEnabled=false&interfaceConfig.prejoinPageEnabled=false&interfaceConfig.DISPLAY_WELCOME_FOOTER=false&interfaceConfig.GENERATE_ROOMNAMES_ON_WELCOME_PAGE=false&interfaceConfig.HIDE_INVITE_MORE_HEADER=true&interfaceConfig.HIDE_DEEP_LINKING_LOGO=true&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false&interfaceConfig.TOOLBAR_BUTTONS=%5B%22microphone%22%2C%22camera%22%2C%22desktop%22%2C%22fullscreen%22%2C%22fodeviceselection%22%2C%22hangup%22%2C%22profile%22%2C%22etherpad%22%2C%22settings%22%2C%22raisehand%22%2C%22stats%22%2C%22shortcuts%22%2C%22tileview%22%2C%22videobackgroundblur%22%2C%22mute-everyone%22%5D&appData.localStorageContent=null&userInfo.displayName="${
                consult_info?.first_name
              } ${consult_info?.last_name}"`}
              style={{ height: `100%`, width: `100%` }}
            ></iframe>
          </div>
          <div className="consult-info">
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <div className="info-group-column">
                  <div className="label">Patient Name</div>
                  <div className="value">
                    {consult_info?.prefix} {consult_info?.first_name}{" "}
                    {consult_info?.middle_name} {consult_info?.last_name}{" "}
                    {consult_info?.suffix}
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} md={4}>
                <div className="info-group-column">
                  <div className="label">Resident Name</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      consult_info?.assign_res_desc,
                      "To be decided"
                    )}
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} md={4}>
                <div className="info-group-column">
                  <div className="label">Est. Start At: </div>
                  <div className="value">
                    {InvalidDateTimeToDefault(consult_info?.est_start_at, "-")}
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} md={4}>
                <div className="info-group-column">
                  <div className="label">Started At: </div>
                  <div className="value">
                    {InvalidDateTimeToDefault(consult_info?.consult_at, "-")}
                  </div>
                </div>
              </Grid>

              <Grid item xs={12}>
                <div className="info-group-column">
                  <div className="label">Chief Complaint</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      consult_info?.chief_complaint,
                      <em>Not indicated</em>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info-group-column">
                  <div className="label">Symptoms</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      consult_info?.symptoms,
                      <em>Not indicated</em>
                    )}
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} md={4}>
                <div className="info-group-column">
                  <div className="label">Adviced To Admit: </div>
                  <div className="value">
                    <Chip
                      label={
                        consult_info?.is_advice_admit === "y" ? "Yes" : "No"
                      }
                      color={
                        consult_info?.is_advice_admit === "y"
                          ? "primary"
                          : "secondary"
                      }
                    />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div className="info-group-column">
                  <div className="label">Adviced At: </div>
                  <div className="value">
                    {InvalidDateTimeToDefault(
                      consult_info?.is_advice_admit_at,
                      "-"
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info-group-column">
                  <div className="label">Diagnosis</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      consult_info?.diagnosis,
                      <em>To be decided</em>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </VideoCallUi>
      </>
    );
  }
);

export default TabPatientVideoCall;
