import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import BodyLoader from "../../../Component/BodyLoader";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import AutocompleteHookForm from "../../../Component/HookForm/AutocompleteHookForm";
import DateFieldHookForm from "../../../Component/HookForm/DateFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import LibraryApi from "../../../Services/Api/LibraryApi";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import { OptionItemModel } from "../../../Services/Models/OptionModel";

interface IDialogUpdateConsultDetails {
  open: boolean;
  handleCloseDialog: () => void;
  successCallback: () => void;
  consult_info: ConsultRequestEntity;
}

const form_schema = yup.object({
  chief_complaint: yup.string().nullable().required().label("Chief Complaint"),
  symptoms: yup.string().nullable().required().label("Symptoms"),
  notes: yup.string().nullable().label("Notes"),
  assign_dept_pk: yup.string().required().nullable().label("Department"),
  assign_res_pk: yup.string().nullable().label("Resident"),
  est_start_date: yup.string().nullable().label("Est. Start Date"),
  est_start_time: yup.string().nullable().label("Est. Start Time"),
});

const DialogUpdateConsultDetails: FC<IDialogUpdateConsultDetails> = memo(
  ({ consult_info, ...props }) => {
    const dispatch = useDispatch();

    const form_instance = useForm<any>({
      resolver: yupResolver(form_schema),
      mode: "onChange",
      defaultValues: {
        ...consult_info,
        est_start_date: moment(consult_info.est_start_date),
        est_start_time: moment(consult_info.est_start_time),
      },
    });

    const [loading_initial_data, set_loading_initial_data] =
      useState<boolean>(false);
    const [error_message, set_error_message] = useState("");

    const [dept_resident_options, set_dept_resident_options] = useState<
      Array<OptionItemModel>
    >([]);
    const [fetch_dept_resident_options, set_fetch_dept_resident_options] =
      useState(false);

    const [dept_options, set_dept_options] = useState<Array<OptionItemModel>>(
      []
    );

    const assign_dept_pk = form_instance.watch("assign_dept_pk", false);

    const handleSubmitForm = useCallback(
      async (payload: ConsultRequestEntity) => {
        payload.consult_req_pk = consult_info?.consult_req_pk;
        payload.birth_date = moment(payload.birth_date).format();

        if (!!payload.consult_req_pk) {
          // dispatch(
          //   setGeneralPrompt({
          //     open: true,
          //     custom_title: `Are you sure that you want to add this item?`,
          //     continue_callback: async () => {
          //       dispatch(
          //         showPageLoading({
          //           show: true,
          //           loading_message: "Adding item, thank you for your patience",
          //         })
          //       );
          //       const response = await ConsultAllergyApi.InsertConsultAllergy(
          //         payload
          //       );
          //       dispatch(closePageLoading());
          //       dispatch(
          //         setPageSnackbar(
          //           response?.message?.toString(),
          //           response.success ? "success" : "error"
          //         )
          //       );
          //       if (response.success) {
          //         if (typeof props.successCallback === "function") {
          //           props.successCallback();
          //         }
          //         props.handleCloseDialog();
          //       } else {
          //         set_page_err_msg(response.message.toString());
          //       }
          //     },
          //   })
          // );
        }
      },
      [consult_info]
    );

    useEffect(() => {
      let mounted = true;

      async function fetchData() {
        set_loading_initial_data(true);
        const dept_res = await LibraryApi.GetDepartmentOptions();

        if (dept_res.success) {
          mounted && set_dept_options(dept_res.data);
        } else {
          mounted &&
            set_error_message(
              "Sorry, it looks like we are unable to fetch the some data."
            );
        }

        mounted && set_loading_initial_data(false);
      }

      mounted && !!consult_info && fetchData();

      return () => {
        mounted = false;
      };
    }, [consult_info]);
    useEffect(() => {
      let mounted = true;
      async function fetchData() {
        mounted && set_fetch_dept_resident_options(true);
        const dept_res_opt_res = await LibraryApi.GetDeptResidentOptions(
          assign_dept_pk
        );
        if (dept_res_opt_res.success) {
          mounted && set_dept_resident_options(dept_res_opt_res.data);
        } else {
          mounted && set_error_message(dept_res_opt_res.message.toString());
        }
        mounted && set_fetch_dept_resident_options(false);
      }

      mounted && !!assign_dept_pk && fetchData();

      return () => {
        mounted = false;
      };
    }, [assign_dept_pk]);

    return (
      <>
        <FormDialog
          title="Update Consultation Details"
          open={props.open}
          handleClose={props.handleCloseDialog}
          minWidth={500}
          body={
            <div>
              {loading_initial_data ? (
                <BodyLoader />
              ) : !!error_message ? (
                <Alert severity="error">{error_message}</Alert>
              ) : (
                <FormProvider {...form_instance}>
                  <form
                    onSubmit={form_instance.handleSubmit(handleSubmitForm)}
                    noValidate
                    id="form_instance"
                  >
                    <div
                      style={{
                        margin: `1em`,
                      }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <AutocompleteHookForm
                            name="assign_dept_pk"
                            label="Department"
                            options={dept_options}
                            defaultValue=""
                            InputLabelProps={{
                              shrink: true,
                            }}
                            placeholder="Choose the department for this consultation"
                            required
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <AutocompleteHookForm
                            name="assign_res_pk"
                            label="Assigned Resident"
                            fullWidth={true}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={dept_resident_options}
                            loading={fetch_dept_resident_options}
                            disabled={fetch_dept_resident_options}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <DateFieldHookForm
                            name="exp_start_date"
                            label="Expected Start Date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            type="date"
                            disablePast
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <DateFieldHookForm
                            name="exp_start_time"
                            label="Expected Start Time"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            type="time"
                            disablePast
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextFieldHookForm
                            name="chief_complaint"
                            label="Chief Complaint"
                            fullWidth
                            multiline
                            rows={2}
                            required
                            placeholder="Write the chief complaint here"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextFieldHookForm
                            name="symptoms"
                            label="Symptoms"
                            fullWidth
                            multiline
                            rows={2}
                            required
                            placeholder="Write the symptoms here"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextFieldHookForm
                            name="notes"
                            label="Notes and/or Other Remarks"
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Write the notes and/or other remarks here"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </form>
                </FormProvider>
              )}
            </div>
          }
          actions={
            <>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                form="form_instance"
                disabled={loading_initial_data}
              >
                Save Changes
              </Button>
              <Button
                variant="contained"
                color="secondary"
                type="reset"
                disabled={loading_initial_data}
                onClick={async () => {
                  form_instance.reset({
                    ...consult_info,
                    est_start_date: moment(consult_info.est_start_date),
                    est_start_time: moment(consult_info.est_start_time),
                  });
                }}
              >
                Reset
              </Button>
            </>
          }
        />
      </>
    );
  }
);

export default DialogUpdateConsultDetails;
