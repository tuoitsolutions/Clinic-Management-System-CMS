import { Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useTheme } from "@material-ui/styles";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BodyLoader from "../../Component/BodyLoader";
import ButtonPopper from "../../Component/ButtonPopper";
import LinkTabs, { ILinkTab } from "../../Component/LinkTabs";
import { StringEmptyToDefault } from "../../Hooks/UseStringFormatter";
import { setPageLinksAction } from "../../Services/Actions/PageActions";
import UserApi from "../../Services/Api/UserApi";
import HospResidentEntity from "../../Services/Entities/HospResidentEntity";
import { RootStore } from "../../Services/Store";
import { UserProfileUi } from "../../Styles/GlobalStyles";
import ContainerResAbout from "./ContainerResAbout";
import ContainerResProfEditPic from "./ContainerResProfEditPic";
import TabResProfGeneralInfo from "./TabResProfGeneralInfo";
interface IResidentProfile {}

const ResidentProfile: FC<IResidentProfile> = memo(() => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );

  const [loading_initial_data, set_loading_initial_data] = useState(false);
  const [selected_record, set_selected_record] =
    useState<null | HospResidentEntity>(null);
  const [error_message, set_error_message] = useState("");

  //   const handleReloadRecord = useCallback(async () => {
  //     const hash_key: string = params.hash_key;

  //     if (!!hash_key) {
  //       dispatch(
  //         showPageLoading({
  //           show: true,
  //           loading_message:
  //             "Loading consultation details, thank you for your patience.",
  //         })
  //       );
  //       const selectec_record = await ConsultRequestApi.GetConsultReqByPk(
  //         hash_key
  //       );

  //       dispatch(closePageLoading());

  //       if (selectec_record.success) {
  //         set_selected_record(selectec_record.data);
  //       } else {
  //         let msg = "";
  //         if (!selectec_record.success) {
  //           msg = msg + selectec_record.message?.toString();
  //         }
  //         set_error_message(msg);
  //       }
  //     }
  //   }, [dispatch, params.hash_key]);

  const GenerateTabLinks = useCallback(() => {
    let LinkTabRoutes: Array<ILinkTab> = [
      {
        label: "General Info",
        link: `/profile/general`,
        Component: (
          <TabResProfGeneralInfo
            resident_info={selected_record}
            handleReloadRecord={() => {
              //
            }}
          />
        ),
      },
    ];

    return LinkTabRoutes;
  }, [selected_record]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      set_loading_initial_data(true);

      const selectec_record = await UserApi.GetUserResidentDtls();

      if (selectec_record.success) {
        mounted && set_selected_record(selectec_record.data);
      } else {
        mounted && set_error_message(selectec_record.message?.toString());
      }

      mounted && set_loading_initial_data(false);
    }

    mounted && fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    dispatch(
      setPageLinksAction([
        {
          link: `/profile`,
          title: "Your Profile",
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
          <UserProfileUi theme={theme} maxWidth="xl">
            <div className="actions">
              <Grid
                container
                spacing={1}
                justify="flex-end"
                alignContent="center"
                alignItems="center"
              >
                <Grid item>
                  <ButtonPopper
                    buttonColor="primary"
                    actionLabel="Actions"
                    variant="contained"
                    buttons={[
                      {
                        text: "Change Password",
                        handleClick: () => {},
                      },
                    ]}
                  />
                </Grid>
              </Grid>
            </div>
            <div className="panel-container user-profile">
              <ContainerResProfEditPic />

              <div className="user-name">{selected_record?.res_name}</div>

              <div className="personal-info-ctnr">
                <div className="info-group-column">
                  <div className="label">License Number</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      selected_record?.license_no,
                      <em>Not specified</em>
                    )}
                  </div>
                </div>
                <div className="info-group-column">
                  <div className="label">Specialty</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      selected_record?.specialty,
                      <em>Not specified</em>
                    )}
                  </div>
                </div>
                <div className="info-group-column">
                  <div className="label">Department</div>
                  <div className="value">
                    {StringEmptyToDefault(
                      selected_record?.dept_name,
                      <em>Not specified</em>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-container link-tabs">
              {!!selected_record?.res_pk && !!user_type && (
                <LinkTabs orientation="horizontal" tabs={GenerateTabLinks()} />
              )}
            </div>

            <ContainerResAbout />
          </UserProfileUi>
        )
      )}
    </>
  );
});

export default ResidentProfile;
