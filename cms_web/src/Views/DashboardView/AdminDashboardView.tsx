import {
  CircularProgress,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import "chartjs-plugin-labels";
import React, { FC, memo, useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import BodyLoader from "../../Component/BodyLoader";
import CustomAvatar from "../../Component/CustomAvatar";
import HelpNumber from "../../Helpers/HelpNumber";
import { InvalidDateTimeToDefault } from "../../Hooks/UseDateParser";
import { setPageLinksAction } from "../../Services/Actions/PageActions";
import DashboardApi from "../../Services/Api/DashboardApi";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import HospResidentEntity from "../../Services/Entities/HospResidentEntity";
import {
  LineDashboardModel,
  PieDashboardModel,
} from "../../Services/Models/DashboardModel";
import { RootStore } from "../../Services/Store";
import { StyledTableProfile } from "../../Styles/GlobalStyles";
interface IAdminDashboardView {}

const AdminDashboardView: FC<IAdminDashboardView> = memo(() => {
  const dispatch = useDispatch();

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );

  const [page_error_msg, set_page_error_msg] = useState<string>("");
  const [loading_page, set_loading_page] = useState(false);

  const [total_earning, set_total_earning] = useState<number | null>();

  const [total_consult, set_total_consult] = useState<string>("");

  const [total_hosp_patient, set_total_hosp_patient] = useState<string>("");

  const [total_hosp_resident, set_total_hosp_resident] = useState<string>("");

  const [total_dept, set_total_dept] = useState<string>("");

  const [chart_dept_earning, set_chart_dept_earning] =
    useState<Array<LineDashboardModel> | null>();

  const [chart_daily_earning_30day, set_chart_daily_earning_30day] =
    useState<Array<LineDashboardModel> | null>();

  const [stats_consult, set_stats_consult] = useState<Array<PieDashboardModel>>(
    []
  );

  const [top_resident, set_top_resident] =
    useState<Array<HospResidentEntity> | null>(null);

  const [total_for_approval_consult, set_total_for_approval_consult] =
    useState<Array<ConsultRequestEntity> | null>(null);

  useEffect(() => {
    let mounted = true;
    const load_initial_data = async () => {
      set_loading_page(true);
      const total_earning_res = await DashboardApi.TotalEarning();
      const total_consult_res = await DashboardApi.TotalConsult();
      const total_hosp_pat_res = await DashboardApi.TotalHospPatient();
      const total_hosp_resident_res = await DashboardApi.TotalHospResident();
      const total_dept_res = await DashboardApi.TotalDept();
      const chart_dept_earning_res = await DashboardApi.ChartDeptEarning();
      const chart_daily_earning_30day_res =
        await DashboardApi.ChartDailyEarning30days();
      const stats_consult_res = await DashboardApi.StatsConsult();
      const top_resident_res = await DashboardApi.TopResident();
      const today_for_approval_consult_res =
        await DashboardApi.TodayForApprovalConsult();

      if (
        total_earning_res.success &&
        total_consult_res.success &&
        total_hosp_pat_res.success &&
        total_hosp_resident_res.success &&
        total_dept_res.success &&
        chart_dept_earning_res.success &&
        chart_daily_earning_30day_res.success &&
        stats_consult_res.success &&
        top_resident_res.success &&
        today_for_approval_consult_res.success
      ) {
        set_total_earning(total_earning_res.data);
        set_total_consult(total_consult_res.data);
        set_total_hosp_patient(total_hosp_pat_res.data);
        set_total_hosp_resident(total_hosp_resident_res.data);
        set_total_dept(total_dept_res.data);
        set_chart_dept_earning(chart_dept_earning_res.data);
        set_chart_daily_earning_30day(chart_daily_earning_30day_res.data);
        set_stats_consult(stats_consult_res.data);
        set_top_resident(top_resident_res.data);
        set_total_for_approval_consult(today_for_approval_consult_res.data);
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
          title: "Administrator Records",
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
                  <Grid item xs={6} sm={3}>
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
                  <Grid item xs={6} sm={3}>
                    <div className="stats-item">
                      <div className="value">{total_consult}</div>
                      <div className="label">Total Consultations</div>
                    </div>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <div className="stats-item">
                      <div className="value">{total_hosp_patient}</div>
                      <div className="label">Total Patients</div>
                    </div>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <div className="stats-item">
                      <div className="value">{total_hosp_resident}</div>
                      <div className="label">Total Residents</div>
                    </div>
                  </Grid>

                  {/* <Grid item xs={6} sm={3}>
                      <div className="stats-item">
                        <div className="value">{total_dept}</div>
                        <div className="label">Total Departments</div>
                      </div>
                    </Grid> */}
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="panel-container">
                  <div className="cntr-title">
                    <div className="main">Earnings Per Department</div>
                  </div>
                  {!!chart_dept_earning && (
                    <Line
                      data={{
                        labels: chart_dept_earning.map((i) => i.x),
                        datasets: [
                          {
                            label: "Earnings by Deparment",
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
                            data: chart_dept_earning,
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

              <Grid item xs={12} md={6}>
                <div className="panel-container">
                  <div className="cntr-title">
                    <div className="main">
                      Daily Earning for the past 30 Days
                    </div>
                  </div>
                  {!!chart_dept_earning && (
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

              <Grid item xs={12} md={4}>
                <div className="panel-container">
                  <div className="cntr-title">
                    <div className="main">
                      Proportion of Consultation Status
                    </div>
                  </div>
                  <Pie
                    height={100}
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
              <Grid item xs={12} md={8}>
                <div className="panel-container">
                  <div className="cntr-title">
                    <div className="main">Top Residents</div>
                  </div>
                  <TableContainer style={{ maxHeight: 300 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Resident Profile</TableCell>
                          <TableCell>Specialty</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {top_resident?.length < 1 && (
                          <TableRow>
                            <TableCell align="center" colSpan={2}>
                              <Alert severity="info">
                                No records has been found!
                              </Alert>
                            </TableCell>
                          </TableRow>
                        )}
                        {top_resident?.map((r, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <StyledTableProfile>
                                <CustomAvatar
                                  src={r.pic_dest}
                                  alt={r.first_name?.charAt(0)}
                                  spacing={8}
                                  isBlob={true}
                                  className="profile-photo"
                                />
                                <div className="profile-title">
                                  {r.prefix} {r.first_name} {r.middle_name}{" "}
                                  {r.last_name} {r.suffix}
                                </div>

                                <div className="profile-subtitle">
                                  {r.doc_id}
                                </div>
                              </StyledTableProfile>
                            </TableCell>
                            <TableCell>{r.specialty}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Grid>

              <Grid item xs={12} md={8}>
                <div className="panel-container">
                  <div className="cntr-title">
                    <div className="main">
                      All For Approval Requests of Today
                    </div>
                  </div>
                  <TableContainer style={{ maxHeight: 300 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Patient Name</TableCell>
                          <TableCell>Gender</TableCell>
                          <TableCell>Requested At</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {total_for_approval_consult?.length < 1 && (
                          <TableRow>
                            <TableCell align="center" colSpan={4}>
                              <Alert severity="info">
                                No records has been found!
                              </Alert>
                            </TableCell>
                          </TableRow>
                        )}
                        {total_for_approval_consult?.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell>{row.consult_req_pk}</TableCell>
                            <TableCell>
                              {row.prefix} {row.first_name} {row.last_name}{" "}
                              {row.suffix}
                            </TableCell>
                            <TableCell>
                              {row.gender === "m" && "Male"}
                              {row.gender === "f" && "Female"}
                            </TableCell>
                            <TableCell>
                              {InvalidDateTimeToDefault(row?.request_at, "-")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </>
  );
});

export default AdminDashboardView;
