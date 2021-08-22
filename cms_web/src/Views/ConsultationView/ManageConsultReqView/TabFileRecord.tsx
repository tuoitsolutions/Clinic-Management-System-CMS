import {
  Button,
  Grid,
  IconButton,
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
import PreviewPDF from "../../../Component/PreviewPDF";
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import { setPageSnackbar } from "../../../Services/Actions/PageActions";
import ConsultRequestFileApi from "../../../Services/Api/ConsultRequestFileApi";
import DeptResidentApi from "../../../Services/Api/DeptResidentApi";
import ConsultRequestFileEntity, {
  ConsultRequestFileTableModel,
} from "../../../Services/Entities/ConsultRequestFileEntity";
import { PaginationModel } from "../../../Services/Models/PaginationModel";
import {
  TblColumnModel,
  TblInitialSortModel,
} from "../../../Services/Models/TableModels";

interface ITabDeptResident {
  consult_req_pk: string;
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
    label: "File Name Asc",
    value: {
      column: "file_name",
      direction: "asc",
    },
  },
  {
    label: "File Name Desc",
    value: {
      column: "file_name",
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
    label: "File Name",
    width: 200,
  },
  {
    label: "Encoded On",
    width: 80,
    fixedWidth: true,
  },
];

export const TabDeptResident: FC<ITabDeptResident> = memo(
  ({ consult_req_pk }) => {
    const dispatch = useDispatch();
    const [initial_filter, set_initial_filter] = useState({
      consult_req_pk: consult_req_pk,
      file_name: "",
      date_from: null,
      date_to: null,
    });

    const [data_table, set_data_table] =
      useState<null | ConsultRequestFileTableModel>(null);
    const [fetch_data_table, set_fetch_data_table] = useState<boolean>(false);
    const [reload_data_table, set_reload_data_table] = useState(0);

    const [selected_record, set_selected_record] =
      useState<null | ConsultRequestFileEntity>(null);

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

    const handleSetRecord = useCallback(
      async (cs_file_pk: number) => {
        const response = await ConsultRequestFileApi.GetConsultReqFileByPk(
          cs_file_pk
        );

        console.log(`response`, response);

        if (response.success) {
          set_selected_record(response.data);
        } else {
          dispatch(setPageSnackbar(response?.message?.toString(), "error"));
        }
      },
      [dispatch]
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
        const table_response =
          await ConsultRequestFileApi.GetTableConsultReqFile(filters);

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
          {/* <Grid item xs={12}>
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
          </Grid> */}

          {!!data_table ? (
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
                                      name="file_name"
                                      label="File Name"
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
                                  text: "Preview File",
                                  handleClick: () =>
                                    handleSetRecord(row.cr_file_pk),
                                },
                              ]}
                            />
                          </TableCell>
                          <TableCell>{row.file_name}</TableCell>

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

              {!!selected_record?.file_dest && (
                <>
                  <PreviewPDF
                    file={selected_record?.file_dest}
                    doc_title={`${selected_record?.file_name}`}
                    handleClose={() => {
                      set_selected_record(null);
                    }}
                    actions={
                      <>
                        <IconButton
                        // onClick={() => {
                        //   UsePdf.downloadFile(
                        //     selected_emp_doc.file_download,
                        //     selected_emp_doc.edo_file_name
                        //   );
                        // }}
                        >
                          {/* <GetAppRoundedIcon /> */}
                        </IconButton>
                        {/*
              <IconButton
                onClick={(file: any) => {
                  alert(`edit`);
                }}
              >
                <EditRoundedIcon />
              </IconButton> */}
                      </>
                    }
                  />
                </>
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

export default TabDeptResident;
