import React, { memo } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { RootStore } from "../Services/Store";
import AdminRecordView from "../Views/AdminView/AdminRecordView";
import ConsultReqRecordView from "../Views/ConsultationView/ConsultReqRecordView";
import ManageConsultReqView from "../Views/ConsultationView/ManageConsultReqView";
import AdminDashboardView from "../Views/DashboardView";
import ResidentDashboardView from "../Views/DashboardView/ResidentDashboardView";
import DepartmentRecordView from "../Views/DepartmentView/DepartmentRecordView";
import ManageDepartmentVIew from "../Views/DepartmentView/ManageDepartmentView";
import HospResidentRecordView from "../Views/HospResidentView/HospResidentRecordView";

const AdminRoutes = memo(() => {
  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );
  return (
    <Switch>
      <Route path="/dashboard/" exact>
        <>
          {user_type === "admin" && <AdminDashboardView />}
          {user_type === "hosp_resident" && <ResidentDashboardView />}
        </>
      </Route>
      <Route path="/administrator/" exact>
        <AdminRecordView />
      </Route>
      <Route path="/request/" exact>
        <ConsultReqRecordView />
      </Route>
      <Route path="/request/:hash_key" strict>
        <ManageConsultReqView />
      </Route>

      <Route path="/department/" exact>
        <DepartmentRecordView />
      </Route>
      <Route path="/department/:dept_pk" strict>
        <ManageDepartmentVIew />
      </Route>
      <Route path="/resident/" exact>
        <HospResidentRecordView />
      </Route>
    </Switch>
  );
});

export default AdminRoutes;
