import React, { memo } from "react";
import { Route, Switch } from "react-router-dom";
import AdminRecordView from "../Views/AdminView/AdminRecordView";
import ConsultReqRecordView from "../Views/ConsultationView/ConsultReqRecordView";
import ManageConsultReqView from "../Views/ConsultationView/ManageConsultReqView";
import DepartmentRecordView from "../Views/DepartmentView/DepartmentRecordView";
import ManageDepartmentVIew from "../Views/DepartmentView/ManageDepartmentView";
import HospResidentRecordView from "../Views/HospResidentView/HospResidentRecordView";

const AdminRoutes = memo(() => {
  return (
    <Switch>
      <Route path="/administrator/" exact>
        <AdminRecordView />
      </Route>
      <Route path="/request/" exact>
        <ConsultReqRecordView />
      </Route>
      <Route path="/request/:hash_key" strict>
        <ManageConsultReqView />
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
