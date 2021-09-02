import { CircularProgress, Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "chartjs-plugin-labels";
import React, { FC, memo, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  setPageLinksAction,
  setPageSnackbar,
} from "../../Services/Actions/PageActions";
import DashboardApi from "../../Services/Api/DashboardApi";
import { RootStore } from "../../Services/Store";
import ContainerCharityGraph from "./ContainerCharityGraph";
import ContainerConsultFinished from "./ContainerConsultFinished";
import ContainerConsultSumDept from "./ContainerConsultSumDept";
import ContainerRequestLatestDept from "./ContainerRequestLatestDept";
import ContainerRequestOtherDept from "./ContainerRequestOtherDept";
import { DashboardUi } from "./styles";

interface IResidentDashboardView {}

const ResidentDashboardView: FC<IResidentDashboardView> = memo(() => {
  const dispatch = useDispatch();

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );

  const [total_for_approval, set_total_for_approval] = useState("");
  const [fetch_total_for_approval, set_fetch_total_for_approval] =
    useState(false);

  const [total_paid, set_total_paid] = useState("");
  const [fetch_total_paid, set_fetch_total_paid] = useState(false);

  const [total_started, set_total_started] = useState("");
  const [fetch_total_started, set_fetch_total_started] = useState(false);

  const [total_ended, set_total_ended] = useState("");
  const [fetch_total_ended, set_fetch_total_ended] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      mounted && set_fetch_total_for_approval(true);
      const server_response = await DashboardApi.GetTotalForApproval();

      if (server_response.success) {
        mounted && set_total_for_approval(server_response.data);
      } else {
        dispatch(setPageSnackbar(server_response.message.toString(), "error"));
      }
      mounted && set_fetch_total_for_approval(false);
    };
    mounted && fetchData();
    return () => (mounted = false);
  }, [dispatch, user_type]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      mounted && set_fetch_total_paid(true);
      const server_response = await DashboardApi.GetTotalPaid();

      if (server_response.success) {
        mounted && set_total_paid(server_response.data);
      } else {
        dispatch(setPageSnackbar(server_response.message.toString(), "error"));
      }
      mounted && set_fetch_total_paid(false);
    };
    mounted && fetchData();
    return () => (mounted = false);
  }, [dispatch, user_type]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      mounted && set_fetch_total_started(true);
      const server_response = await DashboardApi.GetTotalStarted();

      if (server_response.success) {
        mounted && set_total_started(server_response.data);
      } else {
        dispatch(setPageSnackbar(server_response.message.toString(), "error"));
      }
      mounted && set_fetch_total_started(false);
    };
    mounted && fetchData();
    return () => (mounted = false);
  }, [dispatch, user_type]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      mounted && set_fetch_total_ended(true);
      const server_response = await DashboardApi.GetTotalEnded();

      if (server_response.success) {
        mounted && set_total_ended(server_response.data);
      } else {
        dispatch(setPageSnackbar(server_response.message.toString(), "error"));
      }
      mounted && set_fetch_total_ended(false);
    };
    mounted && fetchData();
    return () => (mounted = false);
  }, [dispatch, user_type]);

  useEffect(() => {
    dispatch(
      setPageLinksAction([
        {
          link: window.location.pathname,
          title: "Dashboard",
        },
      ])
    );
  }, [dispatch, user_type]);
  return (
    <>
      <DashboardUi maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <div className="container">
              <Grid
                container
                spacing={2}
                alignContent="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <div className="ctnr-title">
                    <div className="main">Consultation Statistics</div>
                    <div className="sub">
                      Overview of all the consultation status
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} lg={8}>
                  <Grid container spacing={3} justify="center">
                    <Grid item xs={12} sm={6} md={3}>
                      <div className="stats-item">
                        <div className="value">
                          {!fetch_total_for_approval ? (
                            total_for_approval
                          ) : (
                            <CircularProgress size="14px" />
                          )}
                        </div>
                        <div className="label">Total For Approval</div>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <div className="stats-item">
                        <div className="value">
                          {!fetch_total_paid ? (
                            total_paid
                          ) : (
                            <CircularProgress size="14px" />
                          )}
                        </div>
                        <div className="label">Total Paid</div>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <div
                        className="stats-item"
                        style={{
                          backgroundColor: `#fafafa7e`,
                        }}
                      >
                        <div className="value">
                          {!fetch_total_started ? (
                            total_started
                          ) : (
                            <CircularProgress size="14px" />
                          )}
                        </div>
                        <div className="label">Total Started</div>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <div className="stats-item">
                        <div className="value">
                          {!fetch_total_ended ? (
                            total_ended
                          ) : (
                            <CircularProgress size="14px" />
                          )}
                        </div>
                        <div className="label">Total Ended</div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} lg={4}>
                  {fetch_total_for_approval &&
                  fetch_total_paid &&
                  fetch_total_started &&
                  fetch_total_ended ? (
                    <div
                      style={{
                        display: `grid`,
                        justifyContent: `center`,
                        justifyItems: `center`,
                      }}
                    >
                      <Skeleton
                        animation="wave"
                        variant="circle"
                        style={{
                          minHeight: 120,
                          minWidth: 120,
                        }}
                      />
                    </div>
                  ) : (
                    <Doughnut
                      style={{ backgroundColor: `transparent` }}
                      data={{
                        labels: ["For Approval", "Paid", "Started", "Ended"],

                        datasets: [
                          {
                            labels: [
                              "For Approval",
                              "Paid",
                              "Started",
                              "Ended",
                            ],
                            data: [
                              total_for_approval,
                              total_paid,
                              total_started,
                              total_ended,
                            ],
                            backgroundColor: [
                              "#ffeb3b",
                              "#4caf50",
                              "#2196f3",
                              "#bdbdbd",
                            ],
                            // backgroundColor: stats_consult.map((a) => {
                            //   return a.bg_color;
                            // }),
                            borderColor: "#fff",
                          },
                        ],
                      }}
                      options={{
                        responsiveAnimationDuration: 1,
                        aspectRatio: 2.7,
                        maintainAspectRatio: false,
                        // cutout: 40,
                        plugins: {
                          labels: {
                            render: "percentage",
                            precision: 0,
                            showZero: true,
                            fontSize: 11,
                            fontColor: "#fff",
                          },
                          tooltip: {
                            enabled: true,
                            displayColors: false,
                          },
                          legend: {
                            display: true,
                            position: "bottom",
                            labels: {
                              boxWidth: 10,
                              color: `rgba(0, 0, 0, 0.4)`,
                              font: {
                                size: 10,
                                family: "Nunito",
                                weight: 900,
                              },
                            },

                            // align: "start",
                          },
                        },
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </div>
          </Grid>

          {user_type === "hosp_resident" && (
            <Grid item xs={12} md={6}>
              <ContainerRequestLatestDept />
            </Grid>
          )}

          <Grid item xs={12} md={user_type === "hosp_resident" ? 6 : 12}>
            <ContainerRequestOtherDept />
          </Grid>

          <Grid item xs={12} md={6}>
            <ContainerConsultFinished />
          </Grid>
          <Grid item xs={12} md={6}>
            <ContainerConsultSumDept />
          </Grid>

          <Grid item xs={12}>
            <ContainerCharityGraph />
          </Grid>
        </Grid>
      </DashboardUi>
    </>
  );
});

export default ResidentDashboardView;
