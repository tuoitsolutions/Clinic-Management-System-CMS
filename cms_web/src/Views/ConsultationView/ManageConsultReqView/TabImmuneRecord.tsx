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
import { useDispatch } from "react-redux";
import BoxLoader from "../../../Assets/loaders/BoxLoader";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import FormikCheckbox from "../../../Component/Formik/FormikCheckbox";
import FormikDateField from "../../../Component/Formik/FormikDateField";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import {
  InvalidDateTimeToDefault,
  InvalidDateToDefault,
} from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import ConsultImmuneApi from "../../../Services/Api/ConsultImmuneApi";
import ConsultImmuneEntity, {
  ConsultImmuneTableModel,
} from "../../../Services/Entities/ConsultImmuneEntity";
import { PaginationModel } from "../../../Services/Models/PaginationModel";
import {
  TblColumnModel,
  TblInitialSortModel,
} from "../../../Services/Models/TableModels";
import DialogAddImmune from "./DialogAddImmune";
import DialogUpdateImmune from "./DialogUpdateImmune";

interface ITabImmuneRecord {
  consult_req_pk: string;
}

const init_tbl_sort: Array<TblInitialSortModel> = [
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
    label: "Vaccine Description (asc)",
    value: {
      column: "vac_desc",
      direction: "asc",
    },
  },
  {
    label: "Vaccine Description (desc)",
    value: {
      column: "vac_desc",
      direction: "desc",
    },
  },
  //
  {
    label: "Type (asc)",
    value: {
      column: "vac_type",
      direction: "asc",
    },
  },
  {
    label: "Type (desc)",
    value: {
      column: "vac_type",
      direction: "desc",
    },
  },
  //
  {
    label: "Date Given (asc)",
    value: {
      column: "date_given",
      direction: "asc",
    },
  },
  {
    label: "Date Given (desc)",
    value: {
      column: "date_given",
      direction: "desc",
    },
  },
];

const tbl_columns: Array<TblColumnModel> = [
  {
    label: "Actions",
    width: 50,
    align: "center",
    fixedWidth: true,
  },
  {
    label: "Vaccine Description",
    width: 200,
  },
  {
    label: "Type",
    width: 150,
  },
  {
    label: "First Dose",
    width: 100,
    fixedWidth: true,
  },
  {
    label: "Next Dose",
    width: 100,
    fixedWidth: true,
  },
  {
    label: "Administered By",
    width: 120,
  },
  {
    label: "Validity",
    width: 100,
    fixedWidth: true,
    align: "center",
  },
  {
    label: "Encoded On",
    width: 150,
    fixedWidth: true,
  },
];

export const TabImmuneRecord: FC<ITabImmuneRecord> = memo(
  ({ consult_req_pk }) => {
    const dispatch = useDispatch();
    const [initial_filter, set_initial_filter] = useState({
      consult_req_pk: consult_req_pk,
      vac_desc: "",
      vac_type: "",
      is_valid: ["y", "n"],
      date_given_from: null,
      date_given_to: null,
      date_from: null,
      date_to: null,
    });

    const [data_table, set_data_table] =
      useState<null | ConsultImmuneTableModel>(null);
    const [fetch_data_table, set_fetch_data_table] = useState<boolean>(false);
    const [reload_data_table, set_reload_data_table] = useState(0);
    const [page_err_msg, set_page_err_msg] = useState("");

    const [selected_record, set_selected_record] =
      useState<null | ConsultImmuneEntity>(null);

    const handleReloadDataTable = useCallback(() => {
      set_reload_data_table((p) => p + 1);
    }, []);

    const [open_add_dialog, set_open_add_dialog] = useState(false);
    const [open_update_dialog, set_open_update_dialog] = useState(false);
    const handleOpenAddDialog = useCallback(() => {
      set_open_add_dialog(true);
    }, []);
    const handleCloseAddDialog = useCallback(() => {
      set_open_add_dialog(false);
      handleReloadDataTable();
    }, [handleReloadDataTable]);

    const handleSetRecord = useCallback(
      async (payload: ConsultImmuneEntity) => {
        set_selected_record(payload);
        set_open_update_dialog(true);
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
    ] = useFilter(initial_filter, init_tbl_sort, 50);

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
        const table_response = await ConsultImmuneApi.GetTableConsultImmune(
          filters
        );

        console.log(`table_response`, table_response);

        if (table_response.success) {
          mounted && set_data_table(table_response.data);
        } else {
          mounted && set_page_err_msg(table_response.message?.toString());
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="flex-end">
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleOpenAddDialog}
                >
                  Add Immunization
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {!!page_err_msg ? (
            <Alert severity="error">{page_err_msg}</Alert>
          ) : !!data_table ? (
            <>
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
                          initialTableSort={init_tbl_sort}
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
                                <Grid container spacing={3}>
                                  <Grid item xs={12}>
                                    <FormikInputField
                                      fullWidth
                                      name="vac_desc"
                                      label="Vaccine Description"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      size="small"
                                    />
                                  </Grid>

                                  <Grid item xs={12}>
                                    <FormikInputField
                                      fullWidth
                                      name="vac_type"
                                      label="Type"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      size="small"
                                    />
                                  </Grid>

                                  <Grid item xs={12}>
                                    <FormikCheckbox
                                      name="is_valid"
                                      label="Validity"
                                      data={[
                                        {
                                          id: "y",
                                          label: "Valid",
                                        },
                                        {
                                          id: "n",
                                          label: "Not valid",
                                        },
                                      ]}
                                      fullWidth
                                    />
                                  </Grid>

                                  <Grid item xs={6}>
                                    <FormikDateField
                                      name="date_given_from"
                                      type="date"
                                      clearable={true}
                                      showTodayButton
                                      label="First Dose From"
                                      size="small"
                                      variant="standard"
                                      disableFuture
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <FormikDateField
                                      name="date_given_to"
                                      type="date"
                                      clearable={true}
                                      showTodayButton
                                      label="First Dose To"
                                      size="small"
                                      variant="standard"
                                      disableFuture
                                    />
                                  </Grid>

                                  <Grid item xs={6}>
                                    <FormikDateField
                                      name="date_from"
                                      type="date"
                                      clearable={true}
                                      showTodayButton
                                      label="Encoded From"
                                      size="small"
                                      variant="standard"
                                      disableFuture
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <FormikDateField
                                      name="date_to"
                                      type="date"
                                      clearable={true}
                                      showTodayButton
                                      label="Encoded To"
                                      size="small"
                                      variant="standard"
                                      disableFuture
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
                        {tbl_columns.map((col, index) => (
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
                            colSpan={tbl_columns?.length}
                          >
                            <Alert>
                              No records has been found! Kindly check your
                              filters
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
                                  text: "Manage Record",
                                  handleClick: () => handleSetRecord(row),
                                },
                              ]}
                            />
                          </TableCell>
                          <TableCell>{row.vac_desc}</TableCell>
                          <TableCell>{row.vac_type}</TableCell>
                          <TableCell>
                            {InvalidDateToDefault(row?.date_given, "-")}
                          </TableCell>
                          <TableCell>
                            {InvalidDateToDefault(row?.next_dose, "-")}
                          </TableCell>

                          <TableCell>
                            <small>{row.administered_by}</small>
                          </TableCell>

                          <TableCell align="center">
                            <Chip
                              size="small"
                              label={
                                row.is_valid === "y" ? "Valid" : "Not valid"
                              }
                              color={
                                row.is_valid === "y" ? "primary" : "secondary"
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
              </Grid>

              {!!consult_req_pk && (
                <DialogAddImmune
                  open={open_add_dialog}
                  consult_req_pk={consult_req_pk}
                  handleCloseDialog={handleCloseAddDialog}
                  successCallback={() => {
                    handleReloadDataTable();
                  }}
                />
              )}

              {!!selected_record && open_update_dialog && (
                <DialogUpdateImmune
                  open={open_update_dialog}
                  selected_record={selected_record}
                  handleCloseDialog={() => {
                    set_open_update_dialog(false);
                    set_selected_record(null);
                  }}
                  successCallback={() => {
                    handleReloadDataTable();
                  }}
                />
              )}
            </>
          ) : (
            <div className="centered-item">
              <BoxLoader />
            </div>
          )}
        </Grid>
      </>
    );
  }
);

export default TabImmuneRecord;
