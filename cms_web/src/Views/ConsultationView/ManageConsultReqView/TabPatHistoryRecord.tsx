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
import { useHistory } from "react-router-dom";
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
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import ConsultRequestEntity, {
  ConsultRequestTableModel,
} from "../../../Services/Entities/ConsultRequestEntity";
import { PaginationModel } from "../../../Services/Models/PaginationModel";
import {
  TblColumnModel,
  TblInitialSortModel,
} from "../../../Services/Models/TableModels";

interface ITabPatHistoryRecord {
  selected_row: ConsultRequestEntity;
}

const init_tbl_sort: Array<TblInitialSortModel> = [
  {
    label: "Latest",
    value: {
      column: "request_at",
      direction: "desc",
    },
  },
  {
    label: "Oldest",
    value: {
      column: "request_at",
      direction: "asc",
    },
  },
  //
  {
    label: "Request Code (asc)",
    value: {
      column: "consult_req_pk",
      direction: "asc",
    },
  },
  {
    label: "Request Code  (desc)",
    value: {
      column: "consult_req_pk",
      direction: "desc",
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

const tbl_columns: Array<TblColumnModel> = [
  {
    label: "Actions",
    width: 70,
    fixedWidth: true,
  },
  {
    label: "Code",
    width: 80,
  },
  {
    label: "Requested By",
    width: 200,
  },
  {
    label: "Gender",
    width: 80,
  },
  {
    label: "Chief Complaint",
    width: 200,
  },
  {
    label: "Symptoms",
    width: 200,
  },
  {
    label: "Status",
    width: 80,
    fixedWidth: true,
    align: "center",
  },
  {
    label: "Encoded On",
    width: 100,
    fixedWidth: true,
  },
];

export const TabPatHistoryRecord: FC<ITabPatHistoryRecord> = memo(
  ({ selected_row }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [initial_filter, set_initial_filter] = useState({
      consult_req_pk: selected_row.consult_req_pk,
      hospital_no: selected_row.hospital_no,
      last_name: "",
      first_name: "",
      email: "",
      chief_complaint: "",
      symptoms: "",
      sts_pk: ["x", "fa", "a", "pd", "s", "e"],
      request_to: null,
      request_from: null,
    });

    const [data_table, set_data_table] =
      useState<null | ConsultRequestTableModel>(null);
    const [fetch_data_table, set_fetch_data_table] = useState<boolean>(false);
    const [reload_data_table, set_reload_data_table] = useState(0);
    const [page_err_msg, set_page_err_msg] = useState("");

    const [selected_record, set_selected_record] =
      useState<null | ConsultRequestEntity>(null);

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
      async (payload: ConsultRequestEntity) => {
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
        const table_response =
          await ConsultRequestApi.GetTablePatConsultHistory(filters);

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
                                <Grid container spacing={4}>
                                  <Grid item xs={6}>
                                    <FormikInputField
                                      fullWidth
                                      name="consult_req_pk"
                                      label="Consult Request Code"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <FormikInputField
                                      fullWidth
                                      name="email"
                                      label="Email Address"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                    />
                                  </Grid>

                                  <Grid item xs={6}>
                                    <FormikInputField
                                      fullWidth
                                      name="first_name"
                                      label="First Name"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                    />
                                  </Grid>

                                  <Grid item xs={6}>
                                    <FormikInputField
                                      fullWidth
                                      name="last_name"
                                      label="Last Name"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                    />
                                  </Grid>

                                  <Grid item xs={6}>
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
                                          id: "x",
                                          label: "Declined",
                                        },
                                        {
                                          id: "fa",
                                          label: "For Approval",
                                        },
                                        {
                                          id: "a",
                                          label: "Approved",
                                        },
                                        {
                                          id: "pd",
                                          label: "Paid",
                                        },
                                        {
                                          id: "s",
                                          label: "Started",
                                        },
                                        {
                                          id: "e",
                                          label: "Ended",
                                        },
                                      ]}
                                      name="sts_pk"
                                      label="Status"
                                      size="small"
                                    />
                                  </Grid>

                                  <Grid item xs={6}>
                                    <FormikDateField
                                      name="request_from"
                                      clearable={true}
                                      showTodayButton
                                      label="Requested From"
                                      type="date"
                                      variant="standard"
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <FormikDateField
                                      name="request_to"
                                      clearable={true}
                                      showTodayButton
                                      label="Requested To"
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

              {/* // */}
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
                            colSpan={tbl_columns.length}
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
                                  text: "Manage Consultation Request",
                                  color: "primary",
                                  handleClick: () => {
                                    history.push(
                                      `/request/${row.hash_key}/file`
                                    );
                                  },
                                },
                              ]}
                            />
                          </TableCell>
                          <TableCell>{row.consult_req_pk}</TableCell>
                          <TableCell>
                            {row.prefix} {row.first_name} {row.last_name}{" "}
                            {row.suffix}
                          </TableCell>
                          <TableCell>
                            {row.gender === "m" && "Male"}
                            {row.gender === "f" && "Female"}
                          </TableCell>
                          <TableCell>
                            <small>{row.chief_complaint}</small>
                          </TableCell>
                          <TableCell>
                            <small>{row.symptoms}</small>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={row?.status?.sts_desc}
                              style={{
                                color: row?.status?.sts_color,
                                backgroundColor: row?.status?.sts_bg_color,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {InvalidDateTimeToDefault(row?.request_at, "-")}
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
      </>
    );
  }
);

export default TabPatHistoryRecord;
