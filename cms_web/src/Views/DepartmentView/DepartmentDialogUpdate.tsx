import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import BodyLoader from "../../Component/BodyLoader";
import ErrorMessage from "../../Component/ErrorMessage";
import FormDialog from "../../Component/FormDialog/FormDialog";
import AutocompleteHookForm from "../../Component/HookForm/AutocompleteHookForm";
import MultiRadioFieldHookForm from "../../Component/HookForm/MultiRadioFieldHookForm";
import PhotoHookForm from "../../Component/HookForm/PhotoHookForm";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import MaskedPhoneNumber from "../../Component/Mask/MaskedPhoneNumber";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import DepartmentApi from "../../Services/Api/DepartmentApi";
import DepartmentEntity from "../../Services/Entities/DepartmentEntity";

interface IDepartmentDialogUpdate {
  handleClose: () => void;
  successCallback?: () => void;
  dept_pk: number;
  open: boolean;
}

const form_schema = yup.object({
  dept_code: yup.string().nullable().required().label("Code"),
  dept_name: yup.string().nullable().label("Department Name"),
  notes: yup.string().nullable().required().label("Notes"),
  is_active: yup.string().nullable().required().label("Active Status"),
});

export const DepartmentDialogUpdate: FC<IDepartmentDialogUpdate> = memo(
  (props) => {
    const dispatch = useDispatch();

    const form_instance = useForm<any>({
      resolver: yupResolver(form_schema),
      mode: "onChange",
    });

    const [loading_initial_data, set_loading_initial_data] = useState(false);
    const [selected_record, set_selected_record] =
      useState<null | DepartmentEntity>(null);
    const [error_message, set_error_message] = useState("");

    const handleSubmitForm = useCallback(
      async (payload: DepartmentEntity) => {
        payload.dept_pk = selected_record.dept_pk;
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to update this hospital department?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message:
                    "Updating hospital department, thank you for your patience",
                })
              );

              const response = await DepartmentApi.UpdateDepartment(payload);

              dispatch(closePageLoading());
              dispatch(
                setPageSnackbar(
                  response?.message?.toString(),
                  response.success ? "success" : "error"
                )
              );
              if (response.success) {
                if (typeof props.successCallback === "function") {
                  props.successCallback();
                }
                form_instance.reset();
              }
            },
          })
        );
      },
      [dispatch, form_instance, props, selected_record?.dept_pk]
    );

    useEffect(() => {
      let mounted = true;

      async function fetchData() {
        set_loading_initial_data(true);
        const selected_record = await DepartmentApi.GetDepartmentByDepartmentPk(
          props.dept_pk
        );

        if (selected_record.success) {
          mounted && set_selected_record(selected_record.data);
          mounted && form_instance.reset(selected_record.data);
        } else {
          mounted &&
            set_error_message(
              "Sorry, it looks like we are unable to fetch the some data."
            );
        }

        set_loading_initial_data(false);
      }

      mounted && !!props?.dept_pk && fetchData();

      return () => {
        mounted = false;
      };
    }, [props.dept_pk]);

    return (
      <>
        <FormDialog
          open={props.open}
          title="Fill up all the required fields to update the administrator"
          minWidth={500}
          body={
            <>
              {!loading_initial_data ? (
                !!error_message ? (
                  <ErrorMessage message={error_message} />
                ) : (
                  <FormProvider {...form_instance}>
                    <form
                      onSubmit={form_instance.handleSubmit(handleSubmitForm)}
                      noValidate
                      id="form_instance"
                    >
                      <div
                        style={{
                          display: `grid`,
                          padding: `1.5em`,
                          backgroundColor: `#fff`,
                          borderRadius: 10,
                        }}
                      >
                        <Grid container spacing={4}>
                          <Grid item xs={12} md={6}>
                            <TextFieldHookForm
                              name="dept_code"
                              label="Department Code"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextFieldHookForm
                              name="dept_name"
                              label="Department Name"
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                              required
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextFieldHookForm
                              name="notes"
                              label="Notes"
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                              multiline
                              rows={3}
                              placeholder="Write some notes here..."
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <MultiRadioFieldHookForm
                              name="is_active"
                              label="Active Status"
                              row={true}
                              required
                              size="small"
                              variant="standard"
                              radio_items={[
                                {
                                  value: "y",
                                  label: "Active",
                                },
                                {
                                  value: "n",
                                  label: "Not Active",
                                },
                              ]}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    </form>
                  </FormProvider>
                )
              ) : (
                <BodyLoader />
              )}
            </>
          }
          actions={
            <>
              <Button
                color="primary"
                form="form_instance"
                variant="contained"
                type="submit"
              >
                Save Unit
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  form_instance.reset();
                }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  props.handleClose();
                }}
              >
                Close
              </Button>
            </>
          }
        />
      </>
    );
  }
);

export default DepartmentDialogUpdate;
