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
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import ConsultProcApi from "../../../Services/Api/ConsultProcApi";
import ConsultProcEntity, {
  ConsultProcTableModel,
} from "../../../Services/Entities/ConsultProcEntity";
import { PaginationModel } from "../../../Services/Models/PaginationModel";
import {
  TblColumnModel,
  TblInitialSortModel,
} from "../../../Services/Models/TableModels";
import DialogAddProc from "./DialogAddProc";
import DialogUpdateProc from "./DialogUpdateProc";

interface ITabProcRecord {
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
    label: "Procedure Description (asc)",
    value: {
      column: "proc_desc",
      direction: "asc",
    },
  },
  {
    label: "Procedure Description (desc)",
    value: {
      column: "proc_desc",
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
    label: "Procedure Description",
    width: 200,
  },
  {
    label: "Status",
    width: 100,
    fixedWidth: true,
    align: "center",
  },
  {
    label: "Encoded On",
    width: 80,
    fixedWidth: true,
  },
];

export const TabProcRecord: FC<ITabProcRecord> = memo(({ consult_req_pk }) => {
  const dispatch = useDispatch();
  const [initial_filter, set_initial_filter] = useState({
    consult_req_pk: consult_req_pk,
    proc_desc: "",
    is_active: ["y", "n"],
    date_from: null,
    date_to: null,
  });

  const [data_table, set_data_table] = useState<null | ConsultProcTableModel>(
    null
  );
  const [fetch_data_table, set_fetch_data_table] = useState<boolean>(false);
  const [reload_data_table, set_reload_data_table] = useState(0);
  const [page_err_msg, set_page_err_msg] = useState("");

  const [selected_record, set_selected_record] =
    useState<null | ConsultProcEntity>(null);

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

  const handleSetRecord = useCallback(async (payload: ConsultProcEntity) => {
    set_selected_record(payload);
    set_open_update_dialog(true);
  }, []);

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
      const table_response = await ConsultProcApi.GetTableConsultProc(filters);

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
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container justify="flex-end">
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                onClick={handleOpenAddDialog}
              >
                Add Proc. Prescription
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
                        variant="head"
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
                                    name="proc_desc"
                                    label="Procedure Description"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    size="small"
                                  />
                                </Grid>

                                <Grid item xs={12}>
                                  <FormikCheckbox
                                    name="is_active"
                                    label="Active Status"
                                    data={[
                                      {
                                        id: "y",
                                        label: "Active",
                                      },
                                      {
                                        id: "n",
                                        label: "Not active",
                                      },
                                    ]}
                                    fullWidth
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
                        <TableCell align="center" colSpan={tbl_columns?.length}>
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
                                text: "Manage Record",
                                handleClick: () => handleSetRecord(row),
                              },
                            ]}
                          />
                        </TableCell>
                        <TableCell>
                          <div>{row.proc_desc}</div>
                          <small>
                            <i>{row.notes}</i>
                          </small>
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={
                              row.is_active === "y" ? "Valid" : "Not valid"
                            }
                            color={
                              row.is_active === "y" ? "primary" : "secondary"
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
              <DialogAddProc
                open={open_add_dialog}
                consult_req_pk={consult_req_pk}
                handleCloseDialog={handleCloseAddDialog}
                successCallback={() => {
                  handleReloadDataTable();
                }}
              />
            )}

            {!!selected_record && open_update_dialog && (
              <DialogUpdateProc
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
});

export default TabProcRecord;
