import { Grid, Typography } from "@material-ui/core";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  Skeleton,
} from "@material-ui/lab";
import React, { memo, FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  InvalidDateTimeToDefault,
  InvalidDateToDefault,
  InvalidTimeToDefault,
} from "../../Hooks/UseDateParser";
import { setPageSnackbar } from "../../Services/Actions/PageActions";
import DashboardApi from "../../Services/Api/DashboardApi";
import ConsultDeptTranLogEntity from "../../Services/Entities/ConsultDeptTranLogEntity";
import { TimelineUi } from "../../Styles/GlobalStyles";

interface ICtnrDeptTranLog {}

export const CtnrDeptTranLog: FC<ICtnrDeptTranLog> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [dept_tran_log, set_dept_tran_log] =
    useState<Array<ConsultDeptTranLogEntity>>();
  const [fetch_dept_tran_log, set_fetch_dept_tran_log] = useState(false);
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      mounted && set_fetch_dept_tran_log(true);
      const server_response = await DashboardApi.GetLatestDeptTranLog();

      if (server_response.success) {
        mounted && set_dept_tran_log(server_response.data);
      } else {
        dispatch(setPageSnackbar(server_response.message.toString(), "error"));
      }
      mounted && set_fetch_dept_tran_log(false);
    };
    mounted && fetchData();
    return () => (mounted = false);
  }, [dispatch]);

  console.log(`dept_tran_log`, dept_tran_log);
  return (
    <>
      <>
        <div className="container">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div className="ctnr-title">
                <div className="main">Department Transfer History</div>
                <div className="sub">
                  These are the department transfer history for the past 30
                  days.
                </div>
              </div>
            </Grid>

            <Grid item xs={12}>
              {fetch_dept_tran_log ? (
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
                <TimelineUi
                  style={{
                    height: 300,
                    minHeight: 300,
                    overflowY: `auto`,
                  }}
                  //   align="alternate"
                  align="left"
                >
                  {dept_tran_log?.map((r, i) => (
                    <TimelineItem key={i}>
                      <TimelineSeparator>
                        <TimelineDot color="primary" />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <div className="timeline-content-main">
                          <div className="datetime">
                            {InvalidDateTimeToDefault(r.encoded_at, "-")}
                          </div>
                          <div className="content">
                            <b>{r.user_info?.full_name}</b> transferred the
                            consultation department from{" "}
                            <span className="from">{r.dept_desc_from} </span>
                            to <span className="to">{r.dept_desc_to} </span>
                          </div>
                        </div>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </TimelineUi>
              )}
            </Grid>
          </Grid>
        </div>{" "}
      </>
    </>
  );
});

export default CtnrDeptTranLog;
