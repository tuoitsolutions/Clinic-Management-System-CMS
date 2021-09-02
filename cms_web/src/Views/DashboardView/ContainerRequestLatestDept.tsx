import {
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
import IconButtonPopper from "../../Component/IconButtonPopper/IconButtonPopper";
import PreviewPictureFtp from "../../Component/PreviewPictureFtp";
import { InvalidDateTimeToDefault } from "../../Hooks/UseDateParser";
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

  return (
    <>
      <div className="container">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className="ctnr-title">
              <div className="main">
                Latest Consultation Requests to Your Department
              </div>
              <div className="sub">
                Overview of all the consultation status in your department.
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            {fetch_latest_consult_req_user_dept ? (
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
              <TableContainer
                className="table-dashboard"
                style={{
                  height: 300,
                  minHeight: 300,
                }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        style={{
                          minWidth: 70,
                          maxWidth: 70,
                        }}
                      >
                        Actions
                      </TableCell>
                      <TableCell>Requested By</TableCell>
                      {/* <TableCell>Resident</TableCell>
                    <TableCell align="center">Charity</TableCell>
                    <TableCell align="center">Status</TableCell> */}
                      <TableCell
                        style={{
                          minWidth: 155,
                          maxWidth: 155,
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
                                text: "Manage Consultation Request",
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
                              spacing={3}
                              api_func={ConsultRequestApi.PreviewRequesterPic}
                              api_params={row.consult_req_pk}
                              watch_change={row.pic_dest}
                            />
                            <div className="profile-title">
                              {row.prefix} {row.first_name} {row.last_name}{" "}
                              {row.suffix}
                            </div>
                            <div className="profile-subtitle">
                              {row.consult_req_pk}
                            </div>
                          </StyledTableProfile>
                        </TableCell>
                        {/* <TableCell>
                        <StyledTableProfile>
                          <PreviewPictureFtp
                            className="profile-photo"
                            spacing={3}
                            api_func={HospResidentApi.PreviewResidentPic}
                            api_params={row.assigned_resident_info?.res_pk}
                            watch_change={row.assigned_resident_info?.pic_dest}
                          />
                          <div className="profile-title">
                            {StringEmptyToDefault(
                              row?.assigned_resident_info?.res_name,
                              <em>To be decided</em>
                            )}
                          </div>

                          <div className="profile-subtitle">
                            {StringEmptyToDefault(
                              row?.assigned_resident_info?.specialty,
                              ""
                            )}
                          </div>
                        </StyledTableProfile>
                      </TableCell>
                      <TableCell align="center">
                        {row?.is_charity === "y" ? "Yes" : "No"}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row?.status?.sts_desc}
                          style={{
                            color: row?.status?.sts_color,
                            backgroundColor: row?.status?.sts_bg_color,
                          }}
                        />
                      </TableCell> */}
                        <TableCell>
                          <small>
                            {InvalidDateTimeToDefault(row?.request_at, "-")}
                          </small>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
});

export default ContainerRequestLatestDept;
