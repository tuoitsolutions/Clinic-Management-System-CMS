import {
  Button,
  Chip,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Form, Formik } from "formik";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BoxLoader from "../../Assets/loaders/BoxLoader";
import CustomAvatar from "../../Component/CustomAvatar";
import DataTableSearch from "../../Component/DataTableSearch";
import DataTableSort from "../../Component/DataTableSort";
import FormikCheckbox from "../../Component/Formik/FormikCheckbox";
import FormikDateField from "../../Component/Formik/FormikDateField";
import FormikInputField from "../../Component/Formik/FormikInputField";
import IconButtonPopper from "../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../Component/LinearLoadingProgress";
import { InvalidDateTimeToDefault } from "../../Hooks/UseDateParser";
import useFilter from "../../Hooks/useFilter";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageLinksAction,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import AdminApi from "../../Services/Api/AdminApi";
import AdminEntity, {
  AdminTableModel,
} from "../../Services/Entities/AdminEntity";
import { PaginationModel } from "../../Services/Models/PaginationModel";
import {
  TblColumnModel,
  TblInitialSortModel,
} from "../../Services/Models/TableModels";
import { RootStore } from "../../Services/Store";
import { StyledTableProfile } from "../../Styles/GlobalStyles";
import AdminDialogCreate from "./AdminDialogCreate";
import AdminDialogUpdate from "./AdminDialogUpdate";

interface AdminRecordViewProps {}

const initialTableSort: Array<TblInitialSortModel> = [
  {
    label: "Latest",
    value: {
      column: "encoded_at",
      direction: "desc",
    },
  },
  {
    label: "Oldest",
    value: {
      column: "encoded_at",
      direction: "asc",
    },
  },
  //
  {
    label: "Employee Id (asc)",
    value: {
      column: "emp_id",
      direction: "asc",
    },
  },
  {
    label: "Employee Id  (desc)",
    value: {
      column: "emp_id",
      direction: "desc",
    },
  },
  //
  //
  {
    label: "Last Name (asc)",
    value: {
      column: "last_name",
      direction: "asc",
    },
  },
  {
    label: "Last Name  (desc)",
    value: {
      column: "last_name",
      direction: "desc",
    },
  },
  //
  {
    label: "First Name (asc)",
    value: {
      column: "first_name",
      direction: "asc",
    },
  },
  {
    label: "First Name  (desc)",
    value: {
      column: "first_name",
      direction: "desc",
    },
  },
];

const tableColumns: Array<TblColumnModel> = [
  {
    label: "Actions",
    width: 70,
    fixedWidth: true,
  },
  {
    label: "Employee",
    width: 250,
  },
  {
    label: "Gender",
    width: 70,
    fixedWidth: true,
  },
  {
    label: "Position",
    width: 100,
  },
  {
    label: "Active",
    width: 100,
    align: "center",
    fixedWidth: true,
  },
  {
    label: "Encoded On",
    width: 100,
    fixedWidth: true,
  },
];

const initial_filter = {
  emp_id: "",
  first_name: "",
  last_name: "",
  is_active: ["y", "n"],
  date_from: null,
  date_to: null,
};

export const AdminRecordView: FC<AdminRecordViewProps> = memo(() => {
  const dispatch = useDispatch();

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );

  const [data_table, set_data_table] = useState<null | AdminTableModel>(null);
  const [fetch_data_table, set_fetch_data_table] = useState<boolean>(false);

  const [
    tableSearch,
    tableLimit,
    tablePage,
    activeSort,
    selectedSortIndex,
    handleSetTableSearch,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChagenSelectedSortIndex,
  ] = useFilter(initial_filter, initialTableSort, 50);

  const [reload_record_count, set_reload_record_count] = useState(0);

  const handleReloadRecord = useCallback(() => {
    set_reload_record_count((c) => c + 1);
  }, []);

  const handleResetAdminPassword = useCallback(
    (payload: AdminEntity) => {
      dispatch(
        setGeneralPrompt({
          open: true,
          custom_title: `Are you sure that you want to reset the administrator's credentials?`,
          continue_callback: async () => {
            dispatch(
              showPageLoading({
                show: true,
                loading_message:
                  "Reseting admnistrator credentials, thank you for your patience",
              })
            );

            const response = await AdminApi.ResetAdminPassword(payload);

            dispatch(closePageLoading());
            dispatch(
              setPageSnackbar(
                response?.message?.toString(),
                response.success ? "success" : "error"
              )
            );
          },
        })
      );
      // UpdateAdmin
    },
    [dispatch]
  );

  useEffect(() => {
    let mounted = true;
    const fetchTableData = async () => {
      const filters: PaginationModel = {
        page: {
          begin: tablePage,
          limit: tableLimit,
        },
        sort: activeSort,
        filters: tableSearch,
      };

      mounted && set_fetch_data_table(true);
      const table_response = await AdminApi.GetTableAdmin(filters);

      if (table_response.success) {
        mounted && set_data_table(table_response.data);
      }
      mounted && set_fetch_data_table(false);
    };

    mounted && !!tableSearch && !!activeSort && fetchTableData();

    return () => {
      mounted = false;
    };
  }, [activeSort, tableLimit, tablePage, tableSearch, reload_record_count]);

  //add dialog
  const [open_create_unit_dialog, set_open_create_dialog] = useState(false);

  //update dialog
  const [selected_record_dialog, set_selected_record_dialog] =
    useState<null | AdminEntity>(null);

  useEffect(() => {
    dispatch(
      setPageLinksAction([
        {
          link: window.location.pathname,
          title: "Administrator Records",
        },
      ])
    );
  }, [dispatch, user_type]);

  return (
    <Container maxWidth="lg">
      {!!data_table ? (
        <div className="panel-container">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12}>
              <Grid container justify="flex-end">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    set_open_create_dialog(true);
                  }}
                >
                  Add Admin
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <Grid
                container
                justify="flex-start"
                alignContent="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <TablePagination
                    rowsPerPageOptions={[50, 250, 500]}
                    component="div"
                    count={!!data_table?.count ? data_table?.count : -1}
                    rowsPerPage={tableLimit}
                    page={tablePage}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid xs={6} item>
              <Grid
                container
                spacing={2}
                alignContent="center"
                alignItems="center"
                justify="flex-end"
              >
                <Grid item>
                  <DataTableSort
                    handleChagenSelectedSortIndex={
                      handleChagenSelectedSortIndex
                    }
                    initialTableSort={initialTableSort}
                    selectedSortIndex={selectedSortIndex}
                  />
                </Grid>

                <Grid item>
                  <DataTableSearch width={400}>
                    <Formik
                      initialValues={tableSearch}
                      enableReinitialize
                      onSubmit={(form_values) => {
                        handleSetTableSearch(form_values);
                      }}
                    >
                      {() => (
                        <Form className="form">
                          <Grid container spacing={4}>
                            <Grid item xs={6}>
                              <FormikInputField
                                fullWidth
                                name="emp_id"
                                label="Employee ID"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <FormikInputField
                                fullWidth
                                name="first_name"
                                label="First Name"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormikInputField
                                fullWidth
                                name="last_name"
                                label="Last Name"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <FormikCheckbox
                                data={[
                                  {
                                    id: "y",
                                    label: "Yes",
                                  },
                                  {
                                    id: "n",
                                    label: "No",
                                  },
                                ]}
                                name="is_active"
                                label="Is Active"
                                size="small"
                              />
                            </Grid>

                            <Grid item xs={6}>
                              <FormikDateField
                                name="date_from"
                                clearable={true}
                                showTodayButton
                                label="Encoded From"
                                type="date"
                                variant="standard"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <FormikDateField
                                name="date_to"
                                clearable={true}
                                showTodayButton
                                label="Encoded To"
                                type="date"
                                variant="standard"
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <div style={{ marginTop: `1em` }}>
                                <Grid container spacing={2} justify="flex-end">
                                  <Grid item>
                                    <Button
                                      type="submit"
                                      variant="contained"
                                      color="primary"
                                    >
                                      Apply Filters
                                    </Button>
                                  </Grid>
                                </Grid>
                              </div>
                            </Grid>
                          </Grid>
                        </Form>
                      )}
                    </Formik>
                  </DataTableSearch>
                </Grid>
              </Grid>
            </Grid>
            <Grid xs={12} item>
              <div>
                <TableContainer
                  style={{
                    maxHeight: 600,
                    minHeight: `60vh`,
                  }}
                >
                  <LinearLoadingProgress show={fetch_data_table} />
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        {tableColumns.map((col, index) => (
                          <TableCell
                            key={index}
                            align={col.align}
                            style={{
                              minWidth: col.width,
                              maxWidth: col.fixedWidth ? col.width : `auto`,
                            }}
                            width={col.width}
                          >
                            {col.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data_table?.table?.length < 1 && (
                        <TableRow>
                          <TableCell
                            align="center"
                            colSpan={tableColumns.length}
                          >
                            <Alert severity="info">
                              No records has been found! Kindly check your
                              filters.
                            </Alert>
                          </TableCell>
                        </TableRow>
                      )}

                      {data_table?.table?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <IconButtonPopper
                              buttons={[
                                {
                                  text: "Update Employee",
                                  color: "primary",
                                  handleClick: () => {
                                    set_selected_record_dialog(row);
                                  },
                                },
                                {
                                  text: "Reset Password",
                                  color: "primary",
                                  handleClick: () => {
                                    handleResetAdminPassword(row);
                                  },
                                },
                              ]}
                            />
                          </TableCell>
                          <TableCell>
                            <StyledTableProfile>
                              <CustomAvatar
                                src={row.pic_dest}
                                alt={row.first_name?.charAt(0)}
                                spacing={8}
                                isBlob={true}
                                className="profile-photo"
                              />
                              <div className="profile-title">
                                {row.first_name} {row.middle_name}{" "}
                                {row.last_name} {row.suffix}
                              </div>

                              <div className="profile-subtitle">
                                {row.emp_id}
                              </div>
                            </StyledTableProfile>
                          </TableCell>

                          <TableCell>
                            {row.gender === "m" && "Male"}{" "}
                            {row.gender === "f" && "Female"}
                          </TableCell>
                          <TableCell>{row.position}</TableCell>

                          <TableCell align="center">
                            <Chip
                              label={row?.is_active === "y" ? "Yes" : "No"}
                              size="small"
                              style={{
                                color:
                                  row?.is_active === "y"
                                    ? "#0d47a1"
                                    : "#b71c1c",
                                backgroundColor:
                                  row?.is_active === "y"
                                    ? "#e3f2fd"
                                    : "#ffebee",
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            {InvalidDateTimeToDefault(row?.encoded_at, "-")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
          </Grid>

          {/* DIALOGS */}

          <AdminDialogCreate
            open={open_create_unit_dialog}
            handleClose={() => {
              set_open_create_dialog(false);
            }}
            successCallback={() => {
              handleReloadRecord();
            }}
          />
          {/* {!!selected_record_dialog?.admin_pk && (
          
          )} */}
          <AdminDialogUpdate
            admin_pk={selected_record_dialog?.admin_pk}
            handleClose={() => {
              set_selected_record_dialog(null);
            }}
            successCallback={() => {
              handleReloadRecord();
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: `100%`,
            minHeight: `60vh`,
            display: `grid`,
            alignItems: `center`,
            justifyItems: `center`,
          }}
        >
          <BoxLoader />
        </div>
      )}
    </Container>
  );
});

export default AdminRecordView;
