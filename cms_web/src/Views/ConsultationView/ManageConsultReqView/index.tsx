import { Chip, Grid, IconButton } from "@material-ui/core";
import DuoRoundedIcon from "@material-ui/icons/DuoRounded";
import { Alert } from "@material-ui/lab";
import { useTheme } from "@material-ui/styles";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BodyLoader from "../../../Component/BodyLoader";
import LinkTabs, { ILinkTab } from "../../../Component/LinkTabs";
import { InvalidDateToDefault } from "../../../Hooks/UseDateParser";
import { StringEmptyToDefault } from "../../../Hooks/UseStringFormatter";
import UseWindow from "../../../Hooks/UseWindow";
import {
  closePageLoading,
  setPageLinksAction,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import { RootStore } from "../../../Services/Store";
import ConsultActionActions from "./ConsultActionActions";
import ConsultActionSend from "./ConsultActionSend";
import ConsultActionStatus from "./ConsultActionStatus";
import ContainerConsultChat from "./ContainerConsultChat";
import ConsultProfilePic from "./ContainerConsultProfilePic";
import DoctorNotesView from "./ContainerDoctorNotes";
import { PatientManageUi } from "./styles";
import TabAllergyRecord from "./TabAllergyRecord";
import TabDeptResident from "./TabFileRecord";
import TabGeneralInfo from "./TabGeneralInfo";
import TabImmuneRecord from "./TabImmuneRecord";
import TabMedProbRecord from "./TabMedProbRecord";
import TabMedRecord from "./TabMedRecord";
import TabPatHistoryRecord from "./TabPatHistoryRecord";
import TabPaymentLog from "./TabPaymentLog";
import TabProcRecord from "./TabProcRecord";
import VitalSignRecord from "./TabVitalSignRecord";
interface IManageConsultReqView {}

interface IParams {
  hash_key: string;
}

const ManageConsultReqView: FC<IManageConsultReqView> = memo(() => {
  const dispatch = useDispatch();
  const params = useParams<IParams>();
  const theme = useTheme();

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );

  const [loading_initial_data, set_loading_initial_data] = useState(false);
  const [selected_record, set_selected_record] =
    useState<null | ConsultRequestEntity>(null);
  const [error_message, set_error_message] = useState("");

  const [is_open_chat, set_is_open_chat] = useState(false);

  const handleReloadRecord = useCallback(async () => {
    const hash_key: string = params.hash_key;

    if (!!hash_key) {
      dispatch(
        showPageLoading({
          show: true,
          loading_message:
            "Loading consultation details, thank you for your patience.",
        })
      );
      const selected_record_res = await ConsultRequestApi.GetConsultReqByPk(
        hash_key
      );

      dispatch(closePageLoading());

      if (selected_record_res.success) {
        set_selected_record(selected_record_res.data);
      } else {
        let msg = "";
        if (!selected_record_res.success) {
          msg = msg + selected_record_res.message?.toString();
        }
        set_error_message(msg);
      }
    }
  }, [dispatch, params.hash_key]);

  const GenerateTabLinks = useCallback(() => {
    let LinkTabRoutes: Array<ILinkTab> = [];

    if (user_type === "hosp_resident") {
      LinkTabRoutes = [
        {
          label: "General",
          link: `/request/${params.hash_key}/general`,
          Component: (
            <TabGeneralInfo
              consult_info={selected_record}
              handleReloadRecord={handleReloadRecord}
            />
          ),
        },
        {
          label: "Files",
          link: `/request/${params.hash_key}/file`,
          Component: (
            <TabDeptResident consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Vital Signs",
          link: `/request/${params.hash_key}/vital-sign`,
          Component: (
            <VitalSignRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Medications",
          link: `/request/${params.hash_key}/medication`,
          Component: (
            <TabMedRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Procedures",
          link: `/request/${params.hash_key}/procedure`,
          Component: (
            <TabProcRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Allergies",
          link: `/request/${params.hash_key}/allergy`,
          Component: (
            <TabAllergyRecord
              consult_req_pk={selected_record?.consult_req_pk}
            />
          ),
        },
        {
          label: "Immunizations",
          link: `/request/${params.hash_key}/immunization`,
          Component: (
            <TabImmuneRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Medical Problems",
          link: `/request/${params.hash_key}/medical-problem`,
          Component: (
            <TabMedProbRecord
              consult_req_pk={selected_record?.consult_req_pk}
            />
          ),
        },
        {
          label: "Patient History",
          link: `/request/${params.hash_key}/patient-history`,
          Component: <TabPatHistoryRecord selected_row={selected_record} />,
        },
        {
          label: "Payment Logs",
          link: `/request/${params.hash_key}/payment-logs`,
          Component: (
            <TabPaymentLog consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
      ];
    } else if (user_type === "admin") {
      LinkTabRoutes = [
        {
          label: "General",
          link: `/request/${params.hash_key}/general`,
          Component: (
            <TabGeneralInfo
              consult_info={selected_record}
              handleReloadRecord={handleReloadRecord}
            />
          ),
        },
        {
          label: "Files",
          link: `/request/${params.hash_key}/file`,
          Component: (
            <TabDeptResident consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },

        {
          label: "Vital Signs",
          link: `/request/${params.hash_key}/vital-sign`,
          Component: (
            <VitalSignRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Medications",
          link: `/request/${params.hash_key}/medication`,
          Component: (
            <TabMedRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Procedures",
          link: `/request/${params.hash_key}/procedure`,
          Component: (
            <TabProcRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Allergies",
          link: `/request/${params.hash_key}/allergy`,
          Component: (
            <TabAllergyRecord
              consult_req_pk={selected_record?.consult_req_pk}
            />
          ),
        },
        {
          label: "Immunizations",
          link: `/request/${params.hash_key}/immunization`,
          Component: (
            <TabImmuneRecord consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
        {
          label: "Medical Problems",
          link: `/request/${params.hash_key}/medical-problem`,
          Component: (
            <TabMedProbRecord
              consult_req_pk={selected_record?.consult_req_pk}
            />
          ),
        },
        {
          label: "Patient History",
          link: `/request/${params.hash_key}/patient-history`,
          Component: <TabPatHistoryRecord selected_row={selected_record} />,
        },
        {
          label: "Payment Logs",
          link: `/request/${params.hash_key}/payment-logs`,
          Component: (
            <TabPaymentLog consult_req_pk={selected_record?.consult_req_pk} />
          ),
        },
      ];
    }

    return LinkTabRoutes;
  }, [selected_record, user_type]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      set_loading_initial_data(true);

      const hash_key: string = params.hash_key;

      if (!!hash_key) {
        const selected_record_res = await ConsultRequestApi.GetConsultReqByPk(
          hash_key
        );

        if (selected_record_res.success) {
          mounted && set_selected_record(selected_record_res.data);
        } else {
          let msg = "";
          if (!selected_record_res.success) {
            msg = msg + selected_record_res.message?.toString();
          }

          mounted && set_error_message(msg);
        }

        set_loading_initial_data(false);
      }
    }

    mounted && fetchData();

    return () => {
      mounted = false;
    };
  }, [params.hash_key]);

  useEffect(() => {
    dispatch(
      setPageLinksAction([
        {
          link: `/request`,
          title: "Requests",
        },
        {
          link: window.location.pathname,
          title: selected_record?.consult_req_pk,
        },
      ])
    );
  }, [dispatch, selected_record, user_type]);

  return (
    <>
      {!!error_message ? (
        <Alert severity="error">{error_message}</Alert>
      ) : loading_initial_data ? (
        <>
          <BodyLoader message="Preparing data, thank you for your patience" />
        </>
      ) : (
        !!selected_record && (
          <PatientManageUi theme={theme} maxWidth="xl">
            <div className="actions">
              <Grid
                container
                spacing={1}
                justify="flex-end"
                alignContent="center"
                alignItems="center"
              >
                <Grid item>
                  <ConsultActionStatus
                    consult_info={selected_record}
                    handleReloadRecord={handleReloadRecord}
                  />
                </Grid>
                <Grid item>
                  <ConsultActionActions
                    consult_info={selected_record}
                    handleReloadRecord={handleReloadRecord}
                  />
                </Grid>
                <Grid item>
                  <ConsultActionSend
                    consult_info={selected_record}
                    handleReloadRecord={handleReloadRecord}
                  />
                </Grid>
              </Grid>
            </div>
            <div className="panel-container patient-profile">
              <ConsultProfilePic />

              <div className="patient-name">
                {selected_record?.prefix} {selected_record?.first_name}{" "}
                {selected_record?.middle_name} {selected_record?.last_name}{" "}
                {selected_record?.suffix}
              </div>

              <div className="consult-status">
                <Chip
                  label={selected_record?.status?.sts_desc}
                  style={{
                    color: selected_record?.status?.sts_color,
                    backgroundColor: selected_record?.status?.sts_bg_color,
                  }}
                />
              </div>

              <div className="profile-actions">
                <Grid container>
                  <Grid item>
                    <ContainerConsultChat selected_row={selected_record} />
                  </Grid>
                  <Grid item>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        if (selected_record?.sts_pk === "s") {
                          UseWindow.PopupWindowCenter({
                            url: `/request/${params?.hash_key}/consult-room`,
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
                <div className="info-group-column">
                  <div className="label">Gender</div>
                  <div className="value">
                    {selected_record?.gender === "m" && "Male"}
                    {selected_record?.gender === "f" && "Female"}
                  </div>
                </div>
                <div className="info-group-column">
                  <div className="label">Date of Birth</div>
                  <div className="value">
                    {InvalidDateToDefault(selected_record?.birth_date, "-")} (
                    {selected_record?.age})
                  </div>
                </div>
                <div className="info-group-column">
                  <div className="label">Charity Patient</div>
                  <div className="value">
                    {selected_record?.is_charity === "y" ? "Yes" : "No"}
                  </div>
                </div>
                <div className="info-group-column">
                  <div className="label">Nationality</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      selected_record?.nat_desc,
                      <em>Not specified</em>
                    )}
                  </div>
                </div>
                <div className="info-group-column">
                  <div className="label">Civil Status</div>
                  <div className="value">
                    {" "}
                    {StringEmptyToDefault(
                      selected_record?.cs_desc,
                      <em>Not specified</em>
                    )}
                  </div>
                </div>
                <div className="info-group-column">
                  <div className="label">Religion</div>
                  <div className="value">
                    {" "}
                    {StringEmptyToDefault(
                      selected_record?.rel_desc,
                      <em>Not specified</em>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-container link-tabs">
              {!!selected_record?.consult_req_pk && !!user_type && (
                <LinkTabs orientation="horizontal" tabs={GenerateTabLinks()} />
              )}
            </div>

            <DoctorNotesView />
          </PatientManageUi>
        )
      )}
    </>
  );
});

export default ManageConsultReqView;
