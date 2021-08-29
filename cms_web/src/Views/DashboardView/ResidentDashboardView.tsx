import { CircularProgress, Container, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import "chartjs-plugin-labels";
import React, { FC, memo, useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import BodyLoader from "../../Component/BodyLoader";
import HelpNumber from "../../Helpers/HelpNumber";
import { setPageLinksAction } from "../../Services/Actions/PageActions";
import DashboardApi from "../../Services/Api/DashboardApi";
import {
  LineDashboardModel,
  PieDashboardModel,
} from "../../Services/Models/DashboardModel";
import { RootStore } from "../../Services/Store";
interface IResidentDashboardView {}

const ResidentDashboardView: FC<IResidentDashboardView> = memo(() => {
  const dispatch = useDispatch();

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );

  const [page_error_msg, set_page_error_msg] = useState<string>("");
  const [loading_page, set_loading_page] = useState(false);

  const [total_earning, set_total_earning] = useState<number | null>();

  const [total_consult, set_total_consult] = useState<string>("");

  const [chart_daily_earning_30day, set_chart_daily_earning_30day] =
    useState<Array<LineDashboardModel> | null>();

  const [stats_consult, set_stats_consult] = useState<Array<PieDashboardModel>>(
    []
  );

  useEffect(() => {
    let mounted = true;
    const load_initial_data = async () => {
      set_loading_page(true);
      const total_earning_res = await DashboardApi.TotalEarning();
      const total_consult_res = await DashboardApi.TotalConsult();
      const chart_daily_earning_30day_res =
        await DashboardApi.ChartDailyEarning30days();
      const stats_consult_res = await DashboardApi.StatsConsult();

      if (
        total_earning_res.success &&
        total_consult_res.success &&
        chart_daily_earning_30day_res.success &&
        stats_consult_res.success
      ) {
        set_total_earning(total_earning_res.data);
        set_total_consult(total_consult_res.data);
        set_chart_daily_earning_30day(chart_daily_earning_30day_res.data);
        set_stats_consult(stats_consult_res.data);
      } else {
        // let err_msg = ``;

        set_page_error_msg(
          "We could not load the data in the dashboard, please try again later."
        );
      }

      set_loading_page(false);
    };

    mounted && load_initial_data();

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
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {loading_page ? (
            <BodyLoader message="Loading dashboard data, thank you for your patience." />
          ) : !!page_error_msg ? (
            <>
              <Alert severity="error">{page_error_msg}</Alert>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  <Grid item xs={4}>
                    <div className="stats-item">
                      <div className="value">
                        {!!total_earning ? (
                          HelpNumber.NumberToMoney(total_earning)
                        ) : (
                          <CircularProgress />
                        )}
                      </div>
                      <div className="label">Total Earnings (PHP)</div>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div className="stats-item">
                      <div className="value">{total_consult}</div>
                      <div className="label">Total Consultations</div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <div className="panel-container">
                  <div className="cntr-title">
                    <div className="main">
                      Proportion of Consultation Status
                    </div>
                  </div>
                  <Pie
                    // height={100}
                    style={{
                      maxHeight: 250,
                    }}
                    data={{
                      labels: stats_consult.map((a) => a.label),
                      datasets: [
                        {
                          labels: stats_consult.map((a) => a.label),
                          data: stats_consult.map((a) => a.total),
                          backgroundColor: stats_consult.map((a) => {
                            return a.bg_color;
                          }),
                          borderColor: "#fff",
                        },
                      ],
                    }}
                    options={{
                      responsiveAnimationDuration: 1,
                      tooltips: {
                        enabled: false,
                      },
                      plugins: {
                        labels: {
                          render: "percentage",
                          precision: 0,
                          showZero: true,
                          fontSize: 12,
                          fontColor: "#fff",
                        },
                      },
                    }}
                  />
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <div className="panel-container">
                  <div className="cntr-title">
                    <div className="main">
                      Daily Earning for the past 30 Days
                    </div>
                  </div>
                  {!!chart_daily_earning_30day && (
                    <Line
                      data={{
                        labels: chart_daily_earning_30day.map((i) => i.x),
                        datasets: [
                          {
                            label: "Earnings",
                            fillColor: "blue",
                            strokeColor: "blue",
                            highlightFill: "blue",
                            highlightStroke: "blue",
                            borderColor: "blue",
                            scales: {
                              yAxes: [
                                {
                                  stacked: true,
                                },
                              ],
                            },
                            data: chart_daily_earning_30day,
                          },
                        ],
                      }}
                      options={{
                        responsiveAnimationDuration: 1,
                        scales: {
                          yAxes: [
                            {
                              scaleLabel: {
                                display: true,
                                labelString: "Population",
                                lineHeight: 2,
                                fontColor: `#333`,
                              },
                              ticks: {
                                beginAtZero: true,
                                userCallback: function (label, index, labels) {
                                  // when the floored value is the same as the value we have a whole number
                                  if (Math.floor(label) === label) {
                                    return label;
                                  }
                                },
                              },
                            },
                          ],
                        },
                      }}
                    />
                  )}
                </div>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </>
  );
});

export default ResidentDashboardView;
