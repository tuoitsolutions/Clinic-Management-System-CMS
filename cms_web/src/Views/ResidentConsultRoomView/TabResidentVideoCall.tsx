import { Chip, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { FC, memo } from "react";
import BodyLoader from "../../Component/BodyLoader";
import { StringEmptyToDefault } from "../../Hooks/UseStringFormatter";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import { Jutsu } from "react-jutsu";
import { useSelector } from "react-redux";
import { InvalidDateTimeToDefault } from "../../Hooks/UseDateParser";
import { RootStore } from "../../Services/Store";
import VideoCallUi from "../../Styles/VideoCallUi";
interface ITabResidentVideoCall {
  consult_info: ConsultRequestEntity;
}

const TabResidentVideoCall: FC<ITabResidentVideoCall> = memo(
  ({ consult_info }) => {
    const user = useSelector((store: RootStore) => store.UserReducer.user);
    return (
      <>
        <VideoCallUi>
          <div className="video">
            <Jutsu
              roomName={consult_info.hash_key + consult_info.consult_link_hash}
              displayName={user?.full_name}
              subject={consult_info.consult_req_pk}
              containerStyles={{
                height: `100%`,
                width: `100%`,
                border: `none`,
              }}
              loadingComponent={<BodyLoader />}
              errorComponent={
                <Alert severity="error">The video could not be loaded.</Alert>
              }
              configOverwrite={{
                enableWelcomePage: false,
                prejoinPageEnabled: false,
                disableLogCollector: true,
                defaultLogLevel: "error",
                startWithVideoMuted: true,
                startWithAudioMuted: true,
                disableDeepLinking: true,
              }}
              onJitsi={(e) => {}}
              loggerConfigOverwrite={{
                disableLogCollector: false,
              }}
              interfaceConfigOverwrite={{
                disableLogCollector: false,
                defaultLogLevel: "error",
                prejoinPageEnabled: false,
                DISPLAY_WELCOME_FOOTER: false,
                GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
                HIDE_INVITE_MORE_HEADER: true,
                HIDE_DEEP_LINKING_LOGO: true,
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                TOOLBAR_BUTTONS: [
                  "microphone",
                  "camera",
                  "desktop",
                  "fullscreen",
                  "fodeviceselection",
                  // "hangup",
                  "profile",
                  "etherpad",
                  "settings",
                  "raisehand",
                  "stats",
                  "shortcuts",
                  "tileview",
                  "videobackgroundblur",
                  "mute-everyone",
                ],
              }}
            />
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

export default TabResidentVideoCall;
