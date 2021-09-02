import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../Component/FormDialog/FormDialog";
import MultiRadioFieldHookForm from "../../Component/HookForm/MultiRadioFieldHookForm";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import DepartmentApi from "../../Services/Api/DepartmentApi";
import AdminEntity from "../../Services/Entities/AdminEntity";

interface IDepartmentDialogCreate {
  open: boolean;
  handleClose: () => void;
  successCallback?: () => void;
}

const form_schema = yup.object({
  dept_code: yup.string().nullable().required().label("Code"),
  dept_name: yup.string().nullable().label("Department Name"),
  notes: yup.string().nullable().required().label("Notes"),
  is_active: yup.string().nullable().required().label("Active Status"),
});

export const DepartmentDialogCreate: FC<IDepartmentDialogCreate> = memo(
  (props) => {
    const dispatch = useDispatch();

    const form_instance = useForm<any>({
      resolver: yupResolver(form_schema),
      mode: "onChange",
    });

    const handleSubmitForm = useCallback(
      async (payload: AdminEntity) => {
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to add this hospital department?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message:
                    "Adding hospital department, thank you for your patience",
                })
              );

              const response = await DepartmentApi.InsertDepartment(payload);

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
                  props.handleClose();
                }
                form_instance.reset();
              }
            },
          })
        );
      },
      [dispatch, form_instance, props]
    );
    return (
      <>
        <FormDialog
          open={props.open}
          title="Fill up all the required fields to add a new hospital department"
          minWidth={500}
          handleClose={() => props.handleClose()}
          body={
            <>
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
            </>
          }
        />
      </>
    );
  }
);

export default DepartmentDialogCreate;
