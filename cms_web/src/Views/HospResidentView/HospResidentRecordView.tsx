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
import PreviewPictureFtp from "../../Component/PreviewPictureFtp";
import { InvalidDateTimeToDefault } from "../../Hooks/UseDateParser";
import useFilter from "../../Hooks/useFilter";
import { StringEmptyToDefault } from "../../Hooks/UseStringFormatter";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageLinksAction,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import AdminApi from "../../Services/Api/AdminApi";
import HospResidentApi from "../../Services/Api/HospResidentApi";
import HosResidentApi from "../../Services/Api/HospResidentApi";
import HospResidentEntity, {
  HospResidentTableModel,
} from "../../Services/Entities/HospResidentEntity";
import { PaginationModel } from "../../Services/Models/PaginationModel";
import {
  TblColumnModel,
  TblInitialSortModel,
} from "../../Services/Models/TableModels";
import { RootStore } from "../../Services/Store";
import { StyledTableProfile } from "../../Styles/GlobalStyles";
import HospResidentDialogCreate from "./HospResidentDialogCreate";
import HospResidentDialogUpdate from "./HospResidentDialogUpdate";

interface HospResidentRecordViewProps {}

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
  //
  {
    label: "Specialty (asc)",
    value: {
      column: "specialty",
      direction: "asc",
    },
  },
  {
    label: "Specialty  (desc)",
    value: {
      column: "specialty",
      direction: "desc",
    },
  },
];

const tableColumns: Array<TblColumnModel> = [
  {
    label: "Actions",
    width: 70,
    fixedWidth: true,
    align: "center",
  },
  {
    label: "Profile",
    width: 250,
  },
  {
    label: "Gender",
    width: 70,
    fixedWidth: true,
  },
  {
    label: "Specialty",
    width: 100,
  },
  {
    label: "Department",
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
    width: 150,
    fixedWidth: true,
  },
];

const initial_filter = {
  specialty: "",
  license_no: "",
  first_name: "",
  last_name: "",
  is_active: ["y", "n"],
  date_from: null,
  date_to: null,
};

export const HospResidentRecordView: FC<HospResidentRecordViewProps> = memo(
  () => {
    const dispatch = useDispatch();

    const user_type = useSelector(
      (store: RootStore) => store.UserReducer.user?.user_type
    );

    const [data_table, set_data_table] =
      useState<null | HospResidentTableModel>(null);
    const [fetch_data_table, set_fetch_data_table] = useState<boolean>(false);
    const [page_error, set_page_error] = useState<string>("");

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
      (payload: HospResidentEntity) => {
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to reset the resident's credentials?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message:
                    "Reseting resident credentials, thank you for your patience",
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
        const table_response = await HosResidentApi.GetTableHospResident(
          filters
        );

        if (table_response.success) {
          mounted && set_data_table(table_response.data);
        } else {
          mounted && set_page_error(table_response.message.toString());
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
      useState<null | HospResidentEntity>(null);

    useEffect(() => {
      dispatch(
        setPageLinksAction([
          {
            link: window.location.pathname,
            title: "Resident Records",
          },
        ])
      );
    }, [dispatch, user_type]);

    return (
      <Container maxWidth="xl">
        {!!page_error ? (
          <Alert severity="error">{page_error}</Alert>
        ) : !!data_table ? (
          <div className="panel-container">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Grid container justify="flex-end">
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      set_open_create_dialog(true);
                    }}
                  >
                    Register Resident
                  </Button>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid
                  container
                  spacing={2}
                  alignContent="center"
                  alignItems="center"
                >
                  <Grid item md={"auto"}>
                    <Grid
                      container
                      justify="flex-start"
                      alignContent="center"
                      alignItems="center"
                      spacing={1}
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
                          variant="head"
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item md={"auto"}>
                    <Grid
                      container
                      spacing={1}
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
                                <Grid container spacing={2}>
                                  <Grid item xs={6}>
                                    <FormikInputField
                                      fullWidth
                                      name="license_no"
                                      label="License Number"
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
                                    <FormikInputField
                                      fullWidth
                                      name="specialty"
                                      label="Specialty"
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

                                  <Grid item xs={12} md={6}>
                                    <FormikDateField
                                      name="date_from"
                                      clearable={true}
                                      showTodayButton
                                      label="Encoded From"
                                      type="date"
                                      variant="standard"
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
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
                                      <Grid
                                        container
                                        spacing={2}
                                        justify="flex-end"
                                      >
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
                            <TableCell align="center">
                              <IconButtonPopper
                                buttonColor="primary"
                                buttons={[
                                  {
                                    text: "Update Resident",
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
                                <PreviewPictureFtp
                                  className="profile-photo"
                                  spacing={5}
                                  api_func={HospResidentApi.PreviewResidentPic}
                                  api_params={row.res_pk}
                                  watch_change={row.pic_dest}
                                />

                                <div className="profile-title">
                                  {row.res_name}
                                </div>

                                <div className="profile-subtitle">
                                  {row.license_no}
                                </div>
                              </StyledTableProfile>
                            </TableCell>

                            <TableCell>
                              {row.gender === "m" && "Male"}{" "}
                              {row.gender === "f" && "Female"}
                            </TableCell>
                            <TableCell>
                              {/* <small>{row.specialty}</small> */}
                              {row.specialty}
                            </TableCell>

                            <TableCell>
                              {/* <small>{row.specialty}</small> */}
                              {row.dept_name}
                            </TableCell>

                            <TableCell align="center">
                              <Chip
                                label={row?.is_active === "y" ? "Yes" : "No"}
                                size="small"
                                color={
                                  row?.is_active === "y"
                                    ? "primary"
                                    : "secondary"
                                }
                              />
                            </TableCell>

                            <TableCell>
                              <small>
                                {InvalidDateTimeToDefault(row?.encoded_at, "-")}
                              </small>
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

            <HospResidentDialogCreate
              open={open_create_unit_dialog}
              handleClose={() => {
                set_open_create_dialog(false);
              }}
              successCallback={() => {
                handleReloadRecord();
              }}
            />
            <HospResidentDialogUpdate
              res_pk={selected_record_dialog?.res_pk}
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
  }
);

export default HospResidentRecordView;
