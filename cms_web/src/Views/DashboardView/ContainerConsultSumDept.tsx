import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "chartjs-plugin-labels";
import React, { FC, memo, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setPageSnackbar } from "../../Services/Actions/PageActions";
import DashboardApi from "../../Services/Api/DashboardApi";
import { LineDashboardModel } from "../../Services/Models/DashboardModel";

interface IContainerConsultSumDept {}

const ContainerConsultSumDept: FC<IContainerConsultSumDept> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [graph_data, set_graph_data] = useState<Array<LineDashboardModel>>();
  const [fetch_graph_data, set_fetch_graph_data] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      mounted && set_fetch_graph_data(true);
      const server_response = await DashboardApi.GetConsultPerDept();

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
                Successful Consultations of each Department
              </div>
              <div className="sub">
                This is the overview of the total successful consultations of
                each department.
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
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
                <Bar
                  height={300}
                  data={{
                    labels: graph_data?.map((i) => i.x),
                    datasets: [
                      {
                        label: "Total Consultations",
                        backgroundColor: "#4caf50",
                        fill: true,
                        scales: {
                          yAxes: [
                            {
                              stacked: true,
                            },
                          ],
                        },
                        data: graph_data?.map((i) => parseInt(i.y)),
                      },
                    ],
                    borderWidth: 1,
                  }}
                  options={{
                    responsiveAnimationDuration: 1,
                    maintainAspectRatio: false,
                    plugins: {
                      labels: {
                        render: () => {},
                      },
                    },
                    scales: {
                      yAxes: {
                        min: 0,
                        max: 25,
                        scaleLabel: {
                          display: true,
                          //   labelString: "Ratings",
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
        </Grid>
      </div>
    </>
  );
});

export default ContainerConsultSumDept;
