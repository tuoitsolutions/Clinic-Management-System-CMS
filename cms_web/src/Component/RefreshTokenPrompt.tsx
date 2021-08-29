import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@material-ui/core";
import SyncProblemRoundedIcon from "@material-ui/icons/SyncProblemRounded";
import {
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr";
import axios from "axios";
import { connect } from "formik";
import moment from "moment";
import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import {
  APP_NAME,
  getAccessToken,
  getRefreshToken,
  getRefreshTokenExpiration,
  getRememberMe,
  removeToken,
  SERVER_URL,
} from "../Helpers/AppConfig";
import {
  InvalidDateTimeToDefault,
  InvalidDateToDefault,
} from "../Hooks/UseDateParser";
import UseInterval from "../Hooks/UseInterval";
import {
  setAdminSocketCon,
  setOnlineUsers,
} from "../Services/Actions/UserActions";
import ResponseModel from "../Services/Models/ServerResponseModel";
import LoadingButton from "./LoadingButton";
const Transition: any = React.forwardRef(function Transition(
  props: any,
  ref: any
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const RefreshTokenPrompt = memo(() => {
  const dispatch = useDispatch();
  const [connection, setConnection] = useState(null);
  const [openRefreshDialog, setOpenRefreshDialog] = useState<boolean>(false);
  const [refreshingToken, setRefreshingToken] = useState<boolean>(false);
  const latestChat = useRef(null);

  const [openMaintenanceDialog, setOpenMaintenanceDialog] =
    useState<boolean>(false);

  const [maintenanceInfo, setMaintenanceInfo] = useState<Date | null>();

  const latestMaintenance = useRef<Date | null>();

  latestChat.current = openRefreshDialog;
  latestMaintenance.current = maintenanceInfo;

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      // .withUrl("https://localhost:44302/api/hubs/timer", {
      .withUrl(`${SERVER_URL}api/hubs/timer`, {
        accessTokenFactory: () => getAccessToken(),
        // skipNegotiation: true,
        // transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.None)
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          dispatch(setAdminSocketCon(connection));

          connection.on("ReceiveTimer", (server_date: Date) => {
            const refresh_expiry = getRefreshTokenExpiration();

            const prompt_time: number = parseInt(
              process.env.REACT_APP_TOKEN_PROMPT_TIME
            );
            setOpenRefreshDialog(
              moment(refresh_expiry).diff(moment(server_date), "seconds") <
                prompt_time
                ? true
                : false
            );
          });

          connection.on("Maintenance", (maintenanceInfo: Date) => {
            setMaintenanceInfo(maintenanceInfo);
            setOpenMaintenanceDialog(true);
          });
          connection.on("OnlineUsers", (users: ResponseModel) => {
            if (users.success) {
              dispatch(setOnlineUsers(users.data));
            }
          });
        })
        .catch((e) => console.error("Connection failed: ", e));
    }
  }, [connection, dispatch]);

  UseInterval(() => {
    //   console.log(`timer`);

    const task = async () => {
      if (connection.connectionStarted) {
        try {
          await connection.send("TriggerTimer");

          // console.log(`triggerTImer`);
        } catch (e) {}
      }
    };

    task();
  }, 5000);

  if (latestChat?.current && latestChat?.current <= 0) {
    removeToken();
    window.location.href = "/login";
  }

  return (
    <>
      <StyledRefreshTokenDialog
        open={openRefreshDialog}
        scroll="body"
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            margin: 0,
            padding: 0,
            borderRadius: 10,
            maxWidth: 400,
            width: 400,
            overflowY: "visible",
          },
        }}
      >
        <DialogTitle>
          <div
            style={{
              display: "grid",
              justifyItems: "center",
              justifyContent: "center",
              marginTop: "-50px",
            }}
          >
            <Avatar
              style={{
                height: "3.5em",
                width: "3.5em",
                backgroundColor: "#8bc34a",
              }}
            >
              <SyncProblemRoundedIcon fontSize="large" />
            </Avatar>
          </div>
        </DialogTitle>

        <DialogContent className="dialog-content">
          <Typography variant="h5" gutterBottom>
            Your session is about to expire!
          </Typography>
          <div
            style={{
              fontSize: `1rem`,
              fontWeight: 900,
              color: `#2196f3`,
            }}
          >
            Do you want to stay signed in?
          </div>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            color={"primary"}
            variant="contained"
            loading={refreshingToken}
            handleClick={async () => {
              // console.log(`getAccessToken()`, getAccessToken());
              setRefreshingToken(true);
              axios
                .post(
                  "/api/user/refresh-token",
                  {
                    RefreshToken: getRefreshToken(),
                    rememberme: getRememberMe(),
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${getAccessToken()}`,
                    },
                  }
                )
                .then((response) => {
                  setRefreshingToken(false);
                  localStorage.setItem(
                    APP_NAME,
                    JSON.stringify({
                      access_token: response.data.access_token,
                      refresh_token: response.data.refresh_token,
                    })
                  );
                  setOpenRefreshDialog(false);
                })
                .catch((err) => {
                  console.clear();
                  removeToken();
                  alert(
                    `It looks like your session has expired, please login again!`
                  );
                  window.location.href = "/login";
                });
            }}
          >
            Yes, keep me signed in
          </LoadingButton>
          <Button
            disableElevation={true}
            variant="contained"
            onClick={() => {
              removeToken();
              window.location.href = "/login";
            }}
          >
            No, sign me out
          </Button>
        </DialogActions>
      </StyledRefreshTokenDialog>

      <StyledRefreshTokenDialog
        open={openMaintenanceDialog}
        scroll="body"
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            margin: 0,
            padding: 0,
            borderRadius: 10,
            maxWidth: 400,
            width: 400,
            overflowY: "visible",
          },
        }}
      >
        <DialogTitle>
          <div
            style={{
              display: "grid",
              justifyItems: "center",
              justifyContent: "center",
              marginTop: "-50px",
            }}
          >
            <Avatar
              style={{
                height: "3.5em",
                width: "3.5em",
                backgroundColor: "#8bc34a",
              }}
            >
              <SyncProblemRoundedIcon fontSize="large" />
            </Avatar>
          </div>
        </DialogTitle>

        <DialogContent className="dialog-content">
          <Typography variant="h5" gutterBottom>
            We will be having a system maintenance at:
          </Typography>
          <div
            style={{
              fontSize: `1rem`,
              fontWeight: 900,
              color: `#2196f3`,
            }}
          >
            {InvalidDateTimeToDefault(maintenanceInfo, "")}
          </div>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            color={"primary"}
            variant="contained"
            loading={refreshingToken}
            handleClick={async () => {
              setOpenMaintenanceDialog(false);
            }}
          >
            Close
          </LoadingButton>
        </DialogActions>
      </StyledRefreshTokenDialog>
    </>
  );
});

export default RefreshTokenPrompt;

const StyledRefreshTokenDialog = styled(Dialog)`
  .dialog-content {
    margin-top: -15px;
    margin-bottom: 1em;
    text-align: center;
  }
  .dialog-actions {
    margin: 1em;
    display: grid;
    grid-gap: 0.5em;
    grid-auto-flow: column;

    width: 100%;
    justify-items: start;
    justify-content: end;
  }
`;
