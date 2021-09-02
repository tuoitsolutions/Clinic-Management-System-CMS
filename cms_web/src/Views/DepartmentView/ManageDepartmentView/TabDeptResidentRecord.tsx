import {
  Button,
  Chip,
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
import BoxLoader from "../../../Assets/loaders/BoxLoader";
import CustomAvatar from "../../../Component/CustomAvatar";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import FormikCheckbox from "../../../Component/Formik/FormikCheckbox";
import FormikDateField from "../../../Component/Formik/FormikDateField";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import DeptResidentApi from "../../../Services/Api/DeptResidentApi";
import DeptResidentEntity, {
  DeptResidentTableModel,
} from "../../../Services/Entities/DeptResidentEntity";
import { PaginationModel } from "../../../Services/Models/PaginationModel";
import {
  TblColumnModel,
  TblInitialSortModel,
} from "../../../Services/Models/TableModels";
import { StyledTableProfile } from "../../../Styles/GlobalStyles";
import DialogDeptResidentAdd from "./DialogDeptResidentAdd";

interface ITabDeptResident {
  dept_pk: string;
}

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
    label: "First Name asc",
    value: {
      column: "first_name",
      direction: "asc",
    },
  },
  {
    label: "First Name desc",
    value: {
      column: "first_name",
      direction: "desc",
    },
  },
  //
  {
    label: "Last Name asc",
    value: {
      column: "last_name",
      direction: "asc",
    },
  },
  {
    label: "Last Name desc",
    value: {
      column: "last_name",
      direction: "desc",
    },
  },
];

const tableColumns: Array<TblColumnModel> = [
  {
    label: "Actions",
    width: 50,
    align: "center",
    fixedWidth: true,
  },
  {
    label: "Resident Profile",
    width: 200,
  },
  {
    label: "Specialty",
    width: 80,
  },
  {
    label: "Active",
    width: 80,
    fixedWidth: true,
    align: `center`,
  },
  {
    label: "Encoded On",
    width: 80,
    fixedWidth: true,
  },
];

export const TabDeptResident: FC<ITabDeptResident> = memo(({ dept_pk }) => {
  const [initial_filter, set_initial_filter] = useState({
    dept_pk: dept_pk,
    first_name: "",
    last_name: "",
    specialty: "",
    is_active: ["y", "n"],
    date_from: null,
    date_to: null,
  });

  console.log(`dept_pk`, dept_pk);

  const [data_table, set_data_table] = useState<null | DeptResidentTableModel>(
    null
  );
  const [fetch_data_table, set_fetch_data_table] = useState<boolean>(false);
  const [reload_data_table, set_reload_data_table] = useState(0);

  const [selected_employee_dependent, set_selected_employee_dependent] =
    useState<null | DeptResidentEntity>(null);

  const handleReloadDataTable = useCallback(() => {
    set_reload_data_table((p) => p + 1);
  }, []);

  const [open_add_dialog, set_open_add_dialog] = useState(false);
  const handleOpenAddDialog = useCallback(() => {
    set_open_add_dialog(true);
  }, []);
  const handleCloseAddDialog = useCallback(() => {
    set_open_add_dialog(false);
    handleReloadDataTable();
  }, [handleReloadDataTable]);

  const handleSetSelectedEmployeeDependent = useCallback(
    (payload: null | DeptResidentEntity) => {
      set_selected_employee_dependent(payload);
    },
    []
  );

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
      const table_response = await DeptResidentApi.GetTableDeptResident(
        filters
      );

      console.log(`table_response`, table_response);

      if (table_response.success) {
        mounted && set_data_table(table_response.data);
      }
      mounted && set_fetch_data_table(false);
    };

    mounted && !!tableSearch && !!activeSort && fetchTableData();

    return () => {
      mounted = false;
    };
  }, [activeSort, tableLimit, tablePage, tableSearch, reload_data_table]);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container justify="flex-end">
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                onClick={handleOpenAddDialog}
              >
                Add Dept. Resident
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {!!data_table ? (
          <>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
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

                <Grid xs={12} md={6} item>
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
                                <Grid item xs={12}>
                                  <FormikInputField
                                    fullWidth
                                    name="first_name"
                                    label="First Name"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    size="small"
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
                                    size="small"
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <FormikInputField
                                    fullWidth
                                    variant="outlined"
                                    name="specialty"
                                    label="Specialty"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    size="small"
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
                                    label="Active"
                                    size="small"
                                  />
                                </Grid>

                                <Grid item xs={6}>
                                  <FormikDateField
                                    name="date_from"
                                    clearable={true}
                                    showTodayButton
                                    label="Encoded From"
                                    size="small"
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <FormikDateField
                                    name="date_to"
                                    clearable={true}
                                    showTodayButton
                                    label="Encoded To"
                                    size="small"
                                  />
                                </Grid>

                                <Grid item xs={12}>
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
            <Grid item xs={12}>
              <TableContainer
                style={{
                  maxHeight: 600,
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
                          style={{ minWidth: col.width }}
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
                          colSpan={tableColumns?.length}
                        >
                          <Alert>
                            No records has been found! Kindly check your filters
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
                                color: "primary",
                                text: "Update Details",
                                handleClick: () =>
                                  handleSetSelectedEmployeeDependent(row),
                              },
                            ]}
                          />
                        </TableCell>
                        <TableCell>
                          <StyledTableProfile>
                            <CustomAvatar
                              src={row?.hosp_res.pic_dest}
                              alt={row?.hosp_res.first_name?.charAt(0)}
                              spacing={8}
                              isBlob={true}
                              className="profile-photo"
                            />
                            <div className="profile-title">
                              {row.hosp_res?.prefix} {row.hosp_res?.first_name}{" "}
                              {row.hosp_res?.middle_name}{" "}
                              {row.hosp_res?.last_name} {row.hosp_res?.suffix}
                            </div>

                            <div className="profile-subtitle">
                              {row?.hosp_res?.license_no}
                            </div>
                          </StyledTableProfile>
                        </TableCell>
                        <TableCell>{row.hosp_res?.specialty}</TableCell>

                        <TableCell align="center">
                          <Chip
                            label={row?.is_active === "y" ? "Yes" : "No"}
                            size="small"
                            style={{
                              color:
                                row?.is_active === "y" ? "#0d47a1" : "#b71c1c",
                              backgroundColor:
                                row?.is_active === "y" ? "#e3f2fd" : "#ffebee",
                            }}
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
            </Grid>
          </>
        ) : (
          <div className="centered-item">
            <BoxLoader />
          </div>
        )}
      </Grid>

      {open_add_dialog && (
        <DialogDeptResidentAdd
          dept_pk={dept_pk}
          open={open_add_dialog}
          handleCloseDialog={handleCloseAddDialog}
        />
      )}

      {/* Extended Components */}
      {/* 
          {!!selected_employee_dependent && (
            <DialogUpdateEmployeeDependent
              open={!!selected_employee_dependent}
              handleCloseDialog={() => {
                handleReloadDataTable();
                handleSetSelectedEmployeeDependent(null);
              }}
              employee_dependent={selected_employee_dependent}
            />
          )} */}
    </>
  );
});

export default TabDeptResident;
