import React, { memo } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PageLoader from "../Component/PageLoader";
import PagePrompt from "../Component/PagePrompt";
import PageSnackbar from "../Component/PageSnackbar";
import PageSuccessPrompt from "../Component/PageSuccessPrompt";
import RefreshTokenPrompt from "../Component/RefreshTokenPrompt";
import ConsultRequestView from "../Views/ConsultRequestView";
import LoginPortal from "../Views/LoginPortal/LoginPortal";
import PaymentView from "../Views/PaymentView";
import PaymentFeedback from "../Views/PaymentView/PaymentFeedback";
import AdminRoutes from "./AdminRoutes";
import Layout from "./Layout/Layout";

const Routes = memo(() => {
  return (
    <div>
      <Router>
        <PageLoader />
        <PagePrompt />
        <PageSnackbar />
        <PageSuccessPrompt />
        <Switch>
          <Route path="/login" exact component={LoginPortal} />
          <Route
            path="/consultation-request"
            exact
            component={ConsultRequestView}
          />
          <Route path="/payment/:feedback" exact component={PaymentFeedback} />

          <Route
            path="/consultation-payment/:hash_key"
            exact
            strict
            component={PaymentView}
          />
          <Layout>
            <RefreshTokenPrompt />
            <AdminRoutes />
          </Layout>
        </Switch>
      </Router>
    </div>
  );
});
export default Routes;
