import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { FC, memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import MultiRadioFieldHookForm from "../../../Component/HookForm/MultiRadioFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultMedApi from "../../../Services/Api/ConsultMedApi";
import ConsultMedEntity from "../../../Services/Entities/ConsultMedEntity";

interface IDialogUpdateMed {
  open: boolean;
  handleCloseDialog: () => void;
  successCallback: () => void;
  selected_record: ConsultMedEntity;
}

const form_schema = yup.object({
  med_desc: yup.string().required().nullable().label("Medicine Description"),
  unit: yup.string().nullable().label("Unit"),
  dosage: yup.string().required().nullable().label("Dosage"),
  duration: yup.string().required().nullable().label("Duration"),

  is_active: yup.string().required().nullable().label("Active Status"),
});

const DialogUpdateMed: FC<IDialogUpdateMed> = memo((props) => {
  const dispatch = useDispatch();

  const [page_err_msg, set_page_err_msg] = useState("");

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: props.selected_record,
  });

  const handleSubmitForm = useCallback(
    async (payload: ConsultMedEntity) => {
      payload.cr_med_pk = props.selected_record.cr_med_pk;

      if (!!payload.cr_med_pk) {
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to update this item?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message: "Updating item, thank you for your patience",
                })
              );
              const response = await ConsultMedApi.UpdateConsultMed(payload);

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
                props.handleCloseDialog();
              }
            },
          })
        );
      }
    },
    [dispatch, props]
  );

  return (
    <>
      <FormDialog
        title="Update the prescribed medication to patient in this consultation"
        open={props.open}
        handleClose={props.handleCloseDialog}
        minWidth={500}
        body={
          !!page_err_msg ? (
            <Alert severity="error">{page_err_msg}</Alert>
          ) : (
            <div>
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
                    <Grid container spacing={5}>
                      <Grid item xs={12}>
                        <TextFieldHookForm
                          name="med_desc"
                          label="Medicine Description"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          required
                          placeholder="Enter the medicine description"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextFieldHookForm
                          name="dosage"
                          label="Dosage"
                          required
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          placeholder="Enter the dosage"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextFieldHookForm
                          name="unit"
                          label="Unit"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          placeholder="Enter the unit"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextFieldHookForm
                          name="duration"
                          label="Duration"
                          required
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          placeholder="Enter the duration here"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <MultiRadioFieldHookForm
                          name="is_active"
                          label="Active Status"
                          row={true}
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
            </div>
          )
        }
        actions={
          <>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              form="form_instance"
            >
              Save Changes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              type="reset"
              onClick={async () => {
                form_instance.reset(props.selected_record);
              }}
            >
              Reset
            </Button>
          </>
        }
      />
    </>
  );
});

export default DialogUpdateMed;
