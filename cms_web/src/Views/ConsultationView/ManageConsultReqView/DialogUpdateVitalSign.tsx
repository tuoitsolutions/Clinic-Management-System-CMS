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
import ConsultVitalSignApi from "../../../Services/Api/ConsultVitalSignApi";
import ConsultVitalSignEntity from "../../../Services/Entities/ConsultVitalSignEntity";

interface IDialogUpdateVitalSign {
  open: boolean;
  handleCloseDialog: () => void;
  successCallback: () => void;
  selected_record: ConsultVitalSignEntity;
}

const form_schema = yup.object({
  blood_pressure: yup.string().required().nullable().label("Blood Pressure"),
  heart_rate: yup.string().nullable().label("Heart Rate"),
  resp_rate: yup.string().required().nullable().label("Respiratory Rate"),
  temperature: yup.string().required().nullable().label("Temperature"),
  height: yup.string().required().nullable().label("Height"),
  weight: yup.string().required().nullable().label("Weight"),
  remarks: yup.string().nullable().label("Remarks"),
  is_valid: yup.string().required().nullable().label("Is Valid"),
});

const DialogUpdateVitalSign: FC<IDialogUpdateVitalSign> = memo((props) => {
  const dispatch = useDispatch();

  const [page_err_msg, set_page_err_msg] = useState("");

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: props.selected_record,
  });

  const handleSubmitForm = useCallback(
    async (payload: ConsultVitalSignEntity) => {
      payload.cr_vs_pk = props.selected_record.cr_vs_pk;

      if (!!payload.cr_vs_pk) {
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
              const response = await ConsultVitalSignApi.UpdateConsultVitalSign(
                payload
              );

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
        title="Update patient vital signs"
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
                      <Grid item xs={6}>
                        <TextFieldHookForm
                          name="blood_pressure"
                          label="Blood pressure"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          required
                          placeholder="Enter the blood pressure"
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextFieldHookForm
                          name="heart_rate"
                          label="Hearte Rate"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          required
                          placeholder="Enter the heart rate"
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextFieldHookForm
                          name="resp_rate"
                          label="Respiratory Rate"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          required
                          placeholder="Enter the respiratory rate"
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextFieldHookForm
                          name="temperature"
                          label="Temperature (c)"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          required
                          placeholder="Enter the temperature"
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextFieldHookForm
                          name="height"
                          label="Height (cm)"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          required
                          placeholder="Enter the height"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextFieldHookForm
                          name="weight"
                          label="Weight"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          required
                          placeholder="Enter the weight (kg)"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextFieldHookForm
                          name="remarks"
                          label="Remarks"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          placeholder="Write some remarks here"
                          multiline
                          rows={2}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <MultiRadioFieldHookForm
                          name="is_valid"
                          label="Validity"
                          row={true}
                          radio_items={[
                            {
                              value: "y",
                              label: "Valid",
                            },
                            {
                              value: "n",
                              label: "Not Valid",
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

export default DialogUpdateVitalSign;
