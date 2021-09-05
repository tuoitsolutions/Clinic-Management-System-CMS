import { CircularProgress, IconButton } from "@material-ui/core";
import AssignmentLateRoundedIcon from "@material-ui/icons/AssignmentLateRounded";
import KeyboardArrowRightRoundedIcon from "@material-ui/icons/KeyboardArrowRightRounded";
import PaymentRoundedIcon from "@material-ui/icons/PaymentRounded";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import { Skeleton } from "@material-ui/lab";
import React, { FC, memo, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { setPageSnackbar } from "../../Services/Actions/PageActions";
import DashboardApi from "../../Services/Api/DashboardApi";
import { RootStore } from "../../Services/Store";
import ContainerRequestLatestDept from "./ContainerRequestLatestDept";

interface IContainerConsultStatus {}

const ContainerConsultStatus: FC<IContainerConsultStatus> = memo(() => {
  const dispatch = useDispatch();

  const [reload, set_reload] = useState(0);

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );
  const [total_for_approval, set_total_for_approval] = useState("");
  const [fetch_total_for_approval, set_fetch_total_for_approval] =
    useState(true);

  const [total_paid, set_total_paid] = useState("");
  const [fetch_total_paid, set_fetch_total_paid] = useState(true);

  const [total_started, set_total_started] = useState("");
  const [fetch_total_started, set_fetch_total_started] = useState(true);

  const [total_ended, set_total_ended] = useState("");
  const [fetch_total_ended, set_fetch_total_ended] = useState(true);

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
  }, [dispatch]);

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
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      mounted && set_fetch_total_started(true);
      const server_response = await DashboardApi.GetTotalStarted();

      if (server_response.success) {
        console.log(`fetch total`);

        mounted && set_total_started(server_response.data);
      } else {
        dispatch(setPageSnackbar(server_response.message.toString(), "error"));
      }
      mounted && set_fetch_total_started(false);
    };
    mounted && fetchData();
    return () => (mounted = false);
  }, [dispatch]);

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
  }, [dispatch]);
  return (
    <div className="stats-container" onClick={() => set_reload((r) => r + 1)}>
      <div className="stats-card-container">
        <div className="stats-item">
          <div className="stats-value">
            {!fetch_total_for_approval ? (
              <span
                style={{
                  color: `#ffeb3b`,
                }}
              >
                {total_for_approval}
              </span>
            ) : (
              <CircularProgress size="14px" />
            )}
          </div>
          <div className="stats-label">Total For Approval</div>
          <div className="stats-icon">
            <IconButton
              style={{
                padding: `.5em`,
                color: `#ffeb3b `,
                backgroundColor: `#ffeb3b2b`,
              }}
            >
              <AssignmentLateRoundedIcon />
            </IconButton>
          </div>
          <div
            className="stats-color"
            style={{ backgroundColor: `#ffeb3b` }}
          ></div>
        </div>

        <div className="stats-item">
          <div className="stats-value">
            {!fetch_total_paid ? (
              <span
                style={{
                  color: `#4caf50`,
                }}
              >
                {total_paid}
              </span>
            ) : (
              <CircularProgress size="14px" />
            )}
          </div>
          <div className="stats-label">Total Paid</div>
          <div className="stats-icon">
            <IconButton
              style={{
                padding: `.5em`,
                color: `#4caf50`,
                backgroundColor: `#e8f5e9`,
              }}
            >
              <PaymentRoundedIcon />
            </IconButton>
          </div>
          <div
            className="stats-color"
            style={{ backgroundColor: `#4caf50` }}
          ></div>
        </div>

        <div className="stats-item">
          <div className="stats-value">
            {!fetch_total_started ? (
              <span
                style={{
                  color: `#2196f3`,
                }}
              >
                {total_started}
              </span>
            ) : (
              <CircularProgress size="14px" />
            )}
          </div>
          <div className="stats-label">Total Ongoing</div>
          <div className="stats-icon">
            <IconButton
              style={{
                padding: `.5em`,
                color: `#2196f3`,
                backgroundColor: `#e8f5e937`,
              }}
            >
              <KeyboardArrowRightRoundedIcon />
            </IconButton>
          </div>
          <div
            className="stats-color"
            style={{ backgroundColor: `#2196f3` }}
          ></div>
        </div>

        <div className="stats-item">
          <div className="stats-value">
            {!fetch_total_ended ? (
              <span
                style={{
                  color: `#bdbdbd`,
                }}
              >
                {total_ended}
              </span>
            ) : (
              <CircularProgress size="14px" />
            )}
          </div>
          <div className="stats-label">Total Finished</div>
          <div className="stats-icon">
            <IconButton
              style={{
                padding: `.5em`,
                color: `#bdbdbd`,
                backgroundColor: `#bdbdbd35`,
              }}
            >
              <StopRoundedIcon />
            </IconButton>
          </div>
          <div
            className="stats-color"
            style={{ backgroundColor: `#bdbdbd` }}
          ></div>
        </div>
      </div>
      <div className="stats-chart-container container">
        {fetch_total_for_approval ||
        fetch_total_paid ||
        fetch_total_started ||
        fetch_total_ended ? (
          <Skeleton
            animation="wave"
            variant="circle"
            style={{
              height: 150,
              width: 150,
            }}
          />
        ) : (
          <Doughnut
            style={{ backgroundColor: `transparent` }}
            data={{
              labels: ["For Approval", "Paid", "Started", "Ended"],

              datasets: [
                {
                  labels: ["For Approval", "Paid", "Started", "Ended"],
                  data: [
                    total_for_approval,
                    total_paid,
                    total_started,
                    total_ended,
                  ],
                  backgroundColor: ["#ffeb3b", "#4caf50", "#2196f3", "#bdbdbd"],
                  borderColor: "#fff",
                },
              ],
            }}
            options={{
              responsiveAnimationDuration: 0,
              animation: {
                duration: 0,
              },
              aspectRatio: 2.5,
              maintainAspectRatio: false,
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
                },
              },
            }}
          />
        )}
      </div>

      <div className="stats-table-container container">
        <ContainerRequestLatestDept />
      </div>
    </div>
  );
});

export default ContainerConsultStatus;
