import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { FC, memo, useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setPageSnackbar } from "../../Services/Actions/PageActions";
import DashboardApi from "../../Services/Api/DashboardApi";
import { LineDashboardModel } from "../../Services/Models/DashboardModel";
import "chartjs-plugin-labels";

interface IContainerCharityGraph {}

interface CharityGraphModel {
  total_charity?: Array<LineDashboardModel>;
  total_non_charity?: Array<LineDashboardModel>;
}

const ContainerCharityGraph: FC<IContainerCharityGraph> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [graph_data, set_graph_data] = useState<CharityGraphModel>();
  const [fetch_graph_data, set_fetch_graph_data] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      mounted && set_fetch_graph_data(true);
      const server_response = await DashboardApi.GetCharity();

      if (server_response.success) {
        mounted && set_graph_data(server_response.data);
      } else {
        dispatch(setPageSnackbar(server_response.message.toString(), "error"));
      }
      mounted && set_fetch_graph_data(false);
    };
    mounted && fetchData();
    return () => (mounted = false);
  }, [dispatch]);

  return (
    <>
      <div className="container">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className="ctnr-title">
              <div className="main">
                Statistics of Charity & Non Charity Consultations
              </div>
              <div className="sub">
                This is the proportion charity and non charity consultation
                requests of <b>all departments</b> for the past 15 days.
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                {fetch_graph_data ? (
                  <>
                    <Skeleton
                      style={{
                        minHeight: 30,
                        marginBottom: `.5em`,
                      }}
                      animation="wave"
                      variant="rect"
                    />
                    <Skeleton
                      animation="wave"
                      style={{
                        minHeight: 230,
                      }}
                      variant="rect"
                    />
                  </>
                ) : (
                  <div>
                    <Line
                      height={300}
                      data={{
                        labels: graph_data?.total_charity?.map((i) => i.x),
                        datasets: [
                          {
                            label: "Charity Consultations",
                            backgroundColor: "blue",
                            yAxisID: "y",
                            scales: {
                              yAxes: [
                                {
                                  stacked: true,
                                },
                              ],
                            },
                            data: graph_data?.total_charity?.map((i) =>
                              parseInt(i.y)
                            ),
                          },
                          {
                            label: "Non-charity Consultations",
                            backgroundColor: "red",
                            yAxisID: "y1",
                            scales: {
                              yAxes: [
                                {
                                  stacked: true,
                                },
                              ],
                            },
                            data: graph_data?.total_non_charity?.map((i) =>
                              parseInt(i.y)
                            ),
                          },
                        ],
                        borderWidth: 1,
                      }}
                      options={{
                        responsive: true,
                        responsiveAnimationDuration: 1,
                        maintainAspectRatio: false,
                        plugins: {
                          labels: {
                            render: () => {},
                          },
                        },
                        scales: {
                          //   y: {
                          //     min: 0,
                          //     max: 25,
                          //     scaleLabel: {
                          //       display: true,
                          //       lineHeight: 2,
                          //       fontColor: `#333`,
                          //     },
                          //     ticks: {
                          //       stepSize: 1,
                          //       precision: 0,
                          //       beginAtZero: true,
                          //       steps: 1,
                          //     },
                          //   },
                          y: {
                            type: "linear",
                            display: true,
                            position: "left",
                            min: 0,
                            max: 25,
                            scaleLabel: {
                              display: true,
                              lineHeight: 2,
                              fontColor: `#333`,
                            },
                            ticks: {
                              stepSize: 1,
                              precision: 0,
                              beginAtZero: true,
                              steps: 1,
                            },
                          },
                          y1: {
                            type: "linear",
                            display: true,
                            position: "right",

                            grid: {
                              drawOnChartArea: false, // only want the grid lines for one axis to show up
                            },
                            min: 0,
                            max: 25,
                            scaleLabel: {
                              display: true,
                              lineHeight: 2,
                              fontColor: `#333`,
                            },
                            ticks: {
                              stepSize: 1,
                              precision: 0,
                              beginAtZero: true,
                              steps: 1,
                            },
                          },
                          xAxes: {
                            ticks: {
                              maxRotation: 45,
                              minRotation: 45,
                              autoSkip: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <div
                  style={{
                    display: `grid`,
                    justifyContent: `center`,
                    justifyItems: `center`,
                    alignContent: `center`,
                    alignItems: `center`,
                    height: `100%`,
                  }}
                >
                  {fetch_graph_data ? (
                    <Skeleton
                      animation="wave"
                      variant="circle"
                      style={{
                        minHeight: 120,
                        minWidth: 120,
                      }}
                    />
                  ) : (
                    <Doughnut
                      style={{ backgroundColor: `transparent` }}
                      data={{
                        labels: ["Charity", "Non Charity"],

                        datasets: [
                          {
                            labels: ["Charity", "Non Charity"],
                            data: [15, 20],
                            backgroundColor: ["blue", "red"],
                            borderColor: "#fff",
                          },
                        ],
                      }}
                      options={{
                        responsiveAnimationDuration: 1,
                        aspectRatio: 2.7,
                        //   maintainAspectRatio: false,
                        //   cutout: 100,
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
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
});

export default ContainerCharityGraph;
