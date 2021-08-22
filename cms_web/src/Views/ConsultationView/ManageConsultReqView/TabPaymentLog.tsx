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
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import FormikDateField from "../../../Component/Formik/FormikDateField";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import PaymongoApi from "../../../Services/Api/PaymongoApi";
import BillPaymongoEntity, {
  BillPaymongoTableModel,
} from "../../../Services/Entities/BillPaymongoEntity";
import { PaginationModel } from "../../../Services/Models/PaginationModel";
import {
  TblColumnModel,
  TblInitialSortModel,
} from "../../../Services/Models/TableModels";

interface ITabPaymentLog {
  consult_req_pk: string;
}

const initialTableSort: Array<TblInitialSortModel> = [
  {
    label: "Latest",
    value: {
      column: "logged_at",
      direction: "desc",
    },
  },
  {
    label: "Oldest",
    value: {
      column: "logged_at",
      direction: "asc",
    },
  },
  //
  {
    label: "ID Asc",
    value: {
      column: "id",
      direction: "asc",
    },
  },
  {
    label: "ID Desc",
    value: {
      column: "id",
      direction: "desc",
    },
  },
  {
    label: "Event Type Asc",
    value: {
      column: "event_type",
      direction: "asc",
    },
  },
  {
    label: "Event Type Desc",
    value: {
      column: "event_type",
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
    label: "Description",
    width: 200,
  },
  {
    label: "Event Type",
    width: 100,
  },
  {
    label: "Source Action",
    width: 100,
  },
  {
    label: "Method",
    width: 100,
  },
  {
    label: "Logged On",
    width: 90,
    fixedWidth: true,
  },
];

export const TabPaymentLog: FC<ITabPaymentLog> = memo(({ consult_req_pk }) => {
  const dispatch = useDispatch();
  const [initial_filter, set_initial_filter] = useState({
    consult_req_pk: consult_req_pk,
    id: "",
    pay_src_id: "",
    event_type: "",
    pay_src_type: "",
    pay_descrip: "",
    date_from: null,
    date_to: null,
  });

  const [data_table, set_data_table] = useState<null | BillPaymongoTableModel>(
    null
  );
  const [fetch_data_table, set_fetch_data_table] = useState<boolean>(false);
  const [reload_data_table, set_reload_data_table] = useState(0);
  const [page_error_message, set_page_error_message] = useState("");

  const [selected_record, set_selected_record] =
    useState<null | BillPaymongoEntity>(null);

  const handleReloadDataTable = useCallback(() => {
    set_reload_data_table((p) => p + 1);
  }, []);

  const [open_view_details_dialog, set_open_view_details_dialog] =
    useState(false);
  const handleOpenAddDialog = useCallback(() => {
    set_open_view_details_dialog(true);
  }, []);
  const handleCloseAddDialog = useCallback(() => {
    set_open_view_details_dialog(false);
  }, []);

  const handleSetRecord = useCallback(
    async (selected_bill?: BillPaymongoEntity) => {
      set_selected_record(selected_bill);
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
      const table_response = await PaymongoApi.GetTablePaymongoLog(filters);

      if (table_response.success) {
        mounted && set_data_table(table_response.data);
      } else {
        set_page_error_message(table_response.message.toString());
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
        {!!page_error_message ? (
          <>
            <Alert severity="error">{page_error_message}</Alert>
          </>
        ) : (
          <>
            {!!data_table && (
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
                                        name="id"
                                        label="Event ID"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        size="small"
                                      />
                                    </Grid>

                                    <Grid item xs={12}>
                                      <FormikInputField
                                        fullWidth
                                        name="pay_src_id"
                                        label="Payment Source ID"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        size="small"
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <FormikInputField
                                        fullWidth
                                        name="pay_descrip"
                                        label="Description"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        size="small"
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <FormikInputField
                                        fullWidth
                                        name="event_type"
                                        label="Event Type"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        size="small"
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <FormikInputField
                                        fullWidth
                                        name="pay_src_type"
                                        label="Payment Source Type"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        size="small"
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
                                    text: "View all details",
                                    handleClick: () => handleSetRecord(row),
                                  },
                                ]}
                              />
                            </TableCell>
                            <TableCell>
                              <small>{row.pay_descrip}</small>
                            </TableCell>
                            <TableCell>
                              <a
                                href={`https://dashboard.paymongo.com/payments/${row.pay_src_id}`}
                                target="__blank"
                              >
                                <Chip
                                  label={row.event_type}
                                  className="uncaps"
                                  size="small"
                                  style={{
                                    backgroundColor:
                                      row.event_type === "payment.paid"
                                        ? "#c5e1a5"
                                        : "inherit",
                                  }}
                                />
                              </a>
                            </TableCell>
                            <TableCell>{row.source_type}</TableCell>
                            <TableCell>{row.pay_src_type}</TableCell>

                            <TableCell>
                              <small>
                                {InvalidDateTimeToDefault(row?.logged_at, "-")}
                              </small>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
    </>
  );
});

export default TabPaymentLog;
