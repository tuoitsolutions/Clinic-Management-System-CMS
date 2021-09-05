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
import {
  InvalidDateTimeToDefault,
  InvalidDateToDefault,
  InvalidTimeToDefault,
} from "../../Hooks/UseDateParser";
import { StringEmptyToDefault } from "../../Hooks/UseStringFormatter";
import { setPageSnackbar } from "../../Services/Actions/PageActions";
import ConsultRequestApi from "../../Services/Api/ConsultRequestApi";
import DashboardApi from "../../Services/Api/DashboardApi";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import { StyledTableProfile } from "../../Styles/GlobalStyles";

interface IContainerRequestOtherDept {}

const ContainerRequestOtherDept: FC<IContainerRequestOtherDept> = memo(() => {
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
      const server_response = await DashboardApi.GetLatestConsultReqOtherDept();

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
                Transferable Consultation of Other Departments
              </div>
              <div className="sub">
                These are list of consultation request that you can take over to
                your department.
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
                          minWidth: 30,
                          maxWidth: 30,
                          width: 30,
                        }}
                      ></TableCell>
                      <TableCell>Requested By</TableCell>
                      <TableCell>Department</TableCell>

                      <TableCell
                        style={{
                          minWidth: 110,
                          maxWidth: 110,
                          width: 110,
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

                        <TableCell>
                          {StringEmptyToDefault(
                            row.assign_dept_desc,
                            <em>No department assigned</em>
                          )}
                        </TableCell>
                        <TableCell>
                          <div
                            className="table-datetime "
                            style={{
                              color: row.is_cut_off === 1 ? `red` : "",
                            }}
                          >
                            <div>
                              {InvalidDateToDefault(row?.request_at, "-")}
                            </div>
                            <div>
                              {InvalidTimeToDefault(row?.request_at, "-")}
                            </div>
                          </div>
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

export default ContainerRequestOtherDept;
