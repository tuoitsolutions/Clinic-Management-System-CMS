import {
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { FC, memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import CustomTab from "../../Component/CustomTabs";
import IconButtonPopper from "../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../Component/LinearLoadingProgress";
import PreviewPictureFtp from "../../Component/PreviewPictureFtp";
import {
  InvalidDateToDefault,
  InvalidTimeToDefault,
} from "../../Hooks/UseDateParser";
import { setPageSnackbar } from "../../Services/Actions/PageActions";
import ConsultRequestApi from "../../Services/Api/ConsultRequestApi";
import DashboardApi from "../../Services/Api/DashboardApi";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import { StyledTableProfile } from "../../Styles/GlobalStyles";

interface IContainerRequestLatestDept {}

const ContainerRequestLatestDept: FC<IContainerRequestLatestDept> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [latest_consult_req_user_dept, set_latest_consult_req_user_dept] =
    useState<Array<ConsultRequestEntity>>();
  const [
    fetch_latest_consult_req_user_dept,
    set_fetch_latest_consult_req_user_dept,
  ] = useState(false);

  const [latest_consult_for_resident, set_latest_consult_for_resident] =
    useState<Array<ConsultRequestEntity>>();

  const [
    fetch_latest_consult_for_resident,
    set_fetch_latest_consult_for_resident,
  ] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      mounted && set_fetch_latest_consult_req_user_dept(true);
      const server_response = await DashboardApi.GetLatestConsultReqUserDept();

      if (server_response.success) {
        mounted && set_latest_consult_req_user_dept(server_response.data);
      } else {
        dispatch(setPageSnackbar(server_response.message.toString(), "error"));
      }
      mounted && set_fetch_latest_consult_req_user_dept(false);
    };
    mounted && fetchData();
    return () => (mounted = false);
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      mounted && set_fetch_latest_consult_for_resident(true);
      const server_response = await DashboardApi.GetLatestConsultForResident();

      if (server_response.success) {
        mounted && set_latest_consult_for_resident(server_response.data);
      } else {
        dispatch(setPageSnackbar(server_response.message.toString(), "error"));
      }
      mounted && set_fetch_latest_consult_for_resident(false);
    };
    mounted && fetchData();
    return () => (mounted = false);
  }, [dispatch]);

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <div className="ctnr-title">
            <div className="main">
              Pending Consultation Under Your Department
            </div>
            <div className="sub">
              Overview of all the consultations with <b>For Approval</b> and{" "}
              <b>Paid</b> status in your department for the past <b>30 days</b>.
            </div>
          </div>
        </Grid>

        <Grid item xs={12}>
          {fetch_latest_consult_req_user_dept ||
          fetch_latest_consult_for_resident ? (
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
                  minHeight: 250,
                }}
                variant="rect"
              />
            </>
          ) : (
            <div>
              <CustomTab
                tabs={[
                  {
                    title: "All Requests",
                    RenderComponent: (
                      <TableContainer
                        className="table-dashboard"
                        style={{
                          height: 250,
                          minHeight: 250,
                        }}
                      >
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                align="center"
                                style={{
                                  minWidth: 30,
                                  maxWidth: 30,
                                  width: 30,
                                }}
                              ></TableCell>
                              <TableCell>Requested By</TableCell>
                              <TableCell align="center">Status</TableCell>
                              <TableCell
                                style={{
                                  minWidth: 110,
                                  width: 110,
                                  maxWidth: 110,
                                }}
                              >
                                Requested On
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {latest_consult_req_user_dept?.map((row, i) => (
                              <TableRow key={i}>
                                <TableCell align="center">
                                  <IconButtonPopper
                                    buttons={[
                                      {
                                        text: "Manage Request",
                                        color: "primary",
                                        handleClick: () => {
                                          history.push(
                                            `/request/${row.hash_key}/general`
                                          );
                                        },
                                      },
                                    ]}
                                  />
                                </TableCell>
                                <TableCell>
                                  <StyledTableProfile>
                                    <PreviewPictureFtp
                                      className="profile-photo"
                                      spacing={4}
                                      api_func={
                                        ConsultRequestApi.PreviewRequesterPic
                                      }
                                      api_params={row.consult_req_pk}
                                      watch_change={row.pic_dest}
                                    />
                                    <div className="profile-title">
                                      {row.prefix} {row.first_name}{" "}
                                      {row.last_name} {row.suffix}
                                    </div>
                                    <div className="profile-subtitle">
                                      {row.consult_req_pk}
                                    </div>
                                  </StyledTableProfile>
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={row?.status?.sts_desc}
                                    style={{
                                      color: row?.status?.sts_color,
                                      backgroundColor:
                                        row?.status?.sts_bg_color,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div
                                    className="table-datetime"
                                    style={{
                                      color: row.is_cut_off === 1 ? `red` : "",
                                    }}
                                  >
                                    <div>
                                      {InvalidDateToDefault(
                                        row?.request_at,
                                        "-"
                                      )}
                                    </div>
                                    <div>
                                      {InvalidTimeToDefault(
                                        row?.request_at,
                                        "-"
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ),
                  },
                  {
                    title: "Assigned For You",
                    RenderComponent: (
                      <TableContainer
                        className="table-dashboard"
                        style={{
                          height: 250,
                          minHeight: 250,
                        }}
                      >
                        <LinearLoadingProgress
                          show={fetch_latest_consult_for_resident}
                        />
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                align="center"
                                style={{
                                  minWidth: 30,
                                  maxWidth: 30,
                                  width: 30,
                                }}
                              ></TableCell>
                              <TableCell>Requested By</TableCell>
                              <TableCell align="center">Status</TableCell>
                              <TableCell
                                style={{
                                  minWidth: 110,
                                  width: 110,
                                  maxWidth: 110,
                                }}
                              >
                                Requested On
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {latest_consult_for_resident?.map((row, i) => (
                              <TableRow key={i}>
                                <TableCell align="center">
                                  <IconButtonPopper
                                    buttons={[
                                      {
                                        text: "Manage Request",
                                        color: "primary",
                                        handleClick: () => {
                                          history.push(
                                            `/request/${row.hash_key}/general`
                                          );
                                        },
                                      },
                                    ]}
                                  />
                                </TableCell>
                                <TableCell>
                                  <StyledTableProfile>
                                    <PreviewPictureFtp
                                      className="profile-photo"
                                      spacing={4}
                                      api_func={
                                        ConsultRequestApi.PreviewRequesterPic
                                      }
                                      api_params={row.consult_req_pk}
                                      watch_change={row.pic_dest}
                                    />
                                    <div className="profile-title">
                                      {row.prefix} {row.first_name}{" "}
                                      {row.last_name} {row.suffix}
                                    </div>
                                    <div className="profile-subtitle">
                                      {row.consult_req_pk}
                                    </div>
                                  </StyledTableProfile>
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={row?.status?.sts_desc}
                                    style={{
                                      color: row?.status?.sts_color,
                                      backgroundColor:
                                        row?.status?.sts_bg_color,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div
                                    className="table-datetime"
                                    style={{
                                      color: row.is_cut_off === 1 ? `red` : "",
                                    }}
                                  >
                                    <div>
                                      {InvalidDateToDefault(
                                        row?.request_at,
                                        "-"
                                      )}
                                    </div>
                                    <div>
                                      {InvalidTimeToDefault(
                                        row?.request_at,
                                        "-"
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ),
                  },
                ]}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
});

export default ContainerRequestLatestDept;
