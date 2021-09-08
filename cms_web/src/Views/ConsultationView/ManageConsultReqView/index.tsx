import { Chip, Grid, IconButton, Switch } from "@material-ui/core";
import DuoRoundedIcon from "@material-ui/icons/DuoRounded";
import { Alert } from "@material-ui/lab";
import { useTheme } from "@material-ui/styles";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BodyLoader from "../../../Component/BodyLoader";
import LinkTabs, { ILinkTab } from "../../../Component/LinkTabs";
import HelpNumber from "../../../Helpers/HelpNumber";
import {
  InvalidDateToDefault,
  InvalidTimeToDefault,
} from "../../../Hooks/UseDateParser";
import { StringEmptyToDefault } from "../../../Hooks/UseStringFormatter";
import UseWindow from "../../../Hooks/UseWindow";
import {
  closePageLoading,
  setGeneralPrompt,
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
import ContainerPatProfile from "./ContainerPatProfile";
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

  // const handleChangeCharityTag = useCallback(async () => {
  //   if (!!selected_record?.consult_req_pk) {
  //     dispatch(
  //       setGeneralPrompt({
  //         open: true,
  //         custom_title: `Are you sure that you want to tag this consultation as ${
  //           selected_record?.is_charity === "y" ? "Non-charity" : "Charity"
  //         }?`,
  //         continue_callback: async () => {
  //           dispatch(
  //             showPageLoading({
  //               show: true,
  //               loading_message: "Saving changes, thank you for your patience",
  //             })
  //           );
  //           const response = await ConsultRequestApi.ChangeCharityTag({
  //             is_charity: selected_record?.is_charity === "y" ? "n" : "y",
  //             consult_req_pk: selected_record.consult_req_pk,
  //           });

  //           dispatch(closePageLoading());
  //           dispatch(
  //             setPageSnackbar(
  //               response?.message?.toString(),
  //               response.success ? "success" : "error"
  //             )
  //           );
  //           if (response.success) {
  //             handleReloadRecord();
  //           }
  //         },
  //       })
  //     );
  //   }
  // }, [dispatch, handleReloadRecord, selected_record]);

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
        // {
        //   label: "Vital Signs",
        //   link: `/request/${params.hash_key}/vital-sign`,
        //   Component: (
        //     <VitalSignRecord consult_req_pk={selected_record?.consult_req_pk} />
        //   ),
        // },
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
          label: "Consult History",
          link: `/request/${params.hash_key}/consult-history`,
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

        // {
        //   label: "Vital Signs",
        //   link: `/request/${params.hash_key}/vital-sign`,
        //   Component: (
        //     <VitalSignRecord consult_req_pk={selected_record?.consult_req_pk} />
        //   ),
        // },
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
          label: "Consult History",
          link: `/request/${params.hash_key}/consult-history`,
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
  }, [handleReloadRecord, params, selected_record, user_type]);

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
              <ContainerPatProfile
                consult_info={selected_record}
                successCallback={handleReloadRecord}
              />
            </div>
            <div className="panel-container link-tabs">
              {!!selected_record?.consult_req_pk && !!user_type && (
                <LinkTabs orientation="horizontal" tabs={GenerateTabLinks()} />
              )}
            </div>

            {/* <DoctorNotesView /> */}
          </PatientManageUi>
        )
      )}
    </>
  );
});

export default ManageConsultReqView;
