import {
  CircularProgress,
  Grid,
  IconButton,
  useTheme,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "chartjs-plugin-labels";
import React, { FC, memo, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  setPageLinksAction,
  setPageSnackbar,
} from "../../Services/Actions/PageActions";
import DashboardApi from "../../Services/Api/DashboardApi";
import { RootStore } from "../../Services/Store";
import ContainerCharityGraph from "./ContainerCharityGraph";
import ContainerConsultFinished from "./ContainerConsultFinished";
import ContainerConsultStatus from "./ContainerConsultStats";
import ContainerConsultSumDept from "./ContainerConsultSumDept";
import ContainerRequestLatestDept from "./ContainerRequestLatestDept";
import ContainerRequestOtherDept from "./ContainerRequestOtherDept";
import CtnrDeptTranLog from "./CtnrDeptTranLog";
import { DashboardUi } from "./styles";

//import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';

interface IDashboardView {}

const DashboardView: FC<IDashboardView> = memo(() => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );

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
      <DashboardUi maxWidth="lg" theme={theme}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <ContainerConsultStatus />
          </Grid>

          {/* {user_type === "hosp_resident" && (
            <Grid item xs={12} md={6}>
              <ContainerRequestLatestDept />
            </Grid>
          )} */}

          <Grid item xs={12} md={7}>
            <ContainerRequestOtherDept />
          </Grid>

          <Grid item xs={12} md={5}>
            <CtnrDeptTranLog />
          </Grid>

          <Grid item xs={12} md={7}>
            <ContainerConsultFinished />
          </Grid>
          <Grid item xs={12} md={5}>
            <ContainerConsultSumDept />
          </Grid>

          {/* <Grid item xs={12}>
            <ContainerCharityGraph />
          </Grid> */}
        </Grid>
      </DashboardUi>
    </>
  );
});

export default DashboardView;
