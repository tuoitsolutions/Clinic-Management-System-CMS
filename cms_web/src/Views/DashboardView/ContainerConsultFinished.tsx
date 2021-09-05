import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { FC, memo, useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setPageSnackbar } from "../../Services/Actions/PageActions";
import DashboardApi from "../../Services/Api/DashboardApi";
import { LineDashboardModel } from "../../Services/Models/DashboardModel";
import "chartjs-plugin-labels";

interface IContainerConsultFinished {}

const ContainerConsultFinished: FC<IContainerConsultFinished> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [finished_consult, set_finished_consult] =
    useState<Array<LineDashboardModel>>();
  const [fetch_finished_consult, set_fetch_finished_consult] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      mounted && set_fetch_finished_consult(true);
      const server_response = await DashboardApi.GetFinishConsult();

      if (server_response.success) {
        mounted && set_finished_consult(server_response.data);
      } else {
        dispatch(setPageSnackbar(server_response.message.toString(), "error"));
      }
      mounted && set_fetch_finished_consult(false);
    };
    mounted && fetchData();
    return () => (mounted = false);
  }, [dispatch]);

  console.log(
    `finished_consult?.map((i) => i.x)`,
    finished_consult?.map((i) => i.x)
  );
  console.log(
    `finished_consult?.map((i) => i.y)`,
    finished_consult?.map((i) => i.y)
  );

  return (
    <>
      <div className="container">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className="ctnr-title">
              <div className="main">
                Successful Consultations of your Department
              </div>
              <div className="sub">
                This is all the successful consultations in{" "}
                <b>your department</b> for the last 30 days.
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            {fetch_finished_consult ? (
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
                    labels: finished_consult?.map((i) => i.x),
                    datasets: [
                      {
                        label: "Finished Consultations",
                        backgroundColor: "#4caf50",
                        fill: true,
                        scales: {
                          yAxes: [
                            {
                              stacked: true,
                            },
                          ],
                        },
                        data: finished_consult?.map((i) => parseInt(i.y)),
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
                          labelString: "Ratings",
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

export default ContainerConsultFinished;
