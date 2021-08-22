import { Button, Chip, Container, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTheme } from "styled-components";
import BodyLoader from "../../../Component/BodyLoader";
import ErrorMessage from "../../../Component/ErrorMessage";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import LinkTabs, { ILinkTab } from "../../../Component/LinkTabs";
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
import { setPageLinksAction } from "../../../Services/Actions/PageActions";
import DepartmentApi from "../../../Services/Api/DepartmentApi";
import DepartmentEntity from "../../../Services/Entities/DepartmentEntity";
import { RootStore } from "../../../Services/Store";
import DepartmentDialogUpdate from "../DepartmentDialogUpdate";
import TabDeptResident from "./TabDeptResidentRecord";

interface IManageDepartmentVIew {}

interface IParams {
  dept_pk: string;
}

const ManageDepartmentVIew: FC<IManageDepartmentVIew> = memo(() => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const params = useParams<IParams>();

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );

  const [loading_initial_data, set_loading_initial_data] = useState(false);
  const [selected_record, set_selected_record] =
    useState<null | DepartmentEntity>(null);
  const [error_message, set_error_message] = useState("");

  const [open_update_dept_dialog, set_open_update_dept_dialog] =
    useState(false);
  const [reload_record_count, set_reload_record_count] = useState(0);
  const handleReloadRecord = useCallback(() => {
    set_reload_record_count((c) => c + 1);
  }, []);

  let LinkTabRoutes: Array<ILinkTab> = [
    {
      label: "Residents",
      link: `/department/${params.dept_pk}/resident`,
      Component: <TabDeptResident dept_pk={params.dept_pk} />,
    },
    {
      label: "Schedules",
      link: `/department/${params.dept_pk}/schedule`,
      Component: <div>...</div>,
    },
  ];

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      set_loading_initial_data(true);

      const dept_pk: number = parseInt(params.dept_pk);

      if (!isNaN(dept_pk)) {
        const selected_record_res =
          await DepartmentApi.GetDepartmentByDepartmentPk(dept_pk);

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
  }, [reload_record_count]);

  useEffect(() => {
    dispatch(
      setPageLinksAction([
        {
          link: `/department`,
          title: "Department Records",
        },
        {
          link: window.location.pathname,
          title: "Manage",
        },
      ])
    );
  }, [dispatch, user_type]);
  return (
    <>
      {!loading_initial_data ? (
        !!error_message ? (
          <Alert>{error_message}</Alert>
        ) : (
          !!selected_record && (
            <Container>
              <Grid container spacing={3}>
                <LinearLoadingProgress show={true} />

                <Grid item xs={12}>
                  <div className="panel-container">
                    <Grid container spacing={6}>
                      <Grid item xs={12}>
                        <Grid item container spacing={3} justify="flex-end">
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                set_open_update_dept_dialog(true);
                              }}
                            >
                              Update Department
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={4} lg={3}>
                            <div className="info-group-column">
                              <div className="label">Department Code: </div>
                              <div className="value">
                                {selected_record?.dept_code}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={3}>
                            <div className="info-group-column">
                              <div className="label">Department Name: </div>
                              <div className="value">
                                {selected_record?.dept_name}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={3}>
                            <div className="info-group-column">
                              <div className="label">Active: </div>
                              <div className="value">
                                <Chip
                                  label={
                                    selected_record?.is_active === "y"
                                      ? "Yes"
                                      : "No"
                                  }
                                  size="small"
                                  style={{
                                    color:
                                      selected_record?.is_active === "y"
                                        ? "#0d47a1"
                                        : "#b71c1c",
                                    backgroundColor:
                                      selected_record?.is_active === "y"
                                        ? "#e3f2fd"
                                        : "#ffebee",
                                  }}
                                />
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={3}>
                            <div className="info-group-column">
                              <div className="label">Encoded On: </div>
                              <div className="value">
                                {InvalidDateTimeToDefault(
                                  selected_record?.encoded_at,
                                  "-"
                                )}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={3}>
                            <div className="info-group-column">
                              <div className="label">Encoded By: </div>
                              <div className="value">
                                {selected_record?.user?.full_name}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} md={9}>
                            <div className="info-group-column">
                              <div className="label">Notes: </div>
                              <div className="value">
                                {selected_record?.notes}
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>

                  <DepartmentDialogUpdate
                    open={open_update_dept_dialog}
                    dept_pk={selected_record.dept_pk}
                    handleClose={() => {
                      set_open_update_dept_dialog(false);
                    }}
                    successCallback={() => {
                      handleReloadRecord();
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <div className="panel-container">
                    <LinkTabs tabs={LinkTabRoutes} />
                  </div>
                </Grid>
              </Grid>
            </Container>
          )
        )
      ) : (
        <BodyLoader />
      )}
    </>
  );
});

export default ManageDepartmentVIew;
