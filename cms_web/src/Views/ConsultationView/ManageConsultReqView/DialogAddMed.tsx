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

interface IDialogAddMed {
  open: boolean;
  handleCloseDialog: () => void;
  successCallback: () => void;
  consult_req_pk: string;
}

const form_schema = yup.object({
  med_desc: yup.string().required().nullable().label("Medicine Description"),
  unit: yup.string().nullable().label("Unit"),
  dosage: yup.string().required().nullable().label("Dosage"),
  is_active: yup.string().required().nullable().label("Active Status"),
});

const DialogAddMed: FC<IDialogAddMed> = memo((props) => {
  const dispatch = useDispatch();

  const form_def_val = {
    med_desc: "",
    unit: "",
    dosage: "",
    is_active: "",
  };

  const [page_err_msg, set_page_err_msg] = useState("");

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: form_def_val,
  });

  const handleSubmitForm = useCallback(
    async (payload: ConsultMedEntity) => {
      payload.consult_req_pk = props.consult_req_pk;

      if (!!payload.consult_req_pk) {
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to add this item?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message: "Adding item, thank you for your patience",
                })
              );
              const response = await ConsultMedApi.InsertConsultMed(payload);

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
              } else {
                set_page_err_msg(response.message.toString());
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
        title="Prescribe a medication to patient in this consultation"
        open={props.open}
        handleClose={props.handleCloseDialog}
        minWidth={500}
        body={
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
                form_instance.reset(form_def_val);
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

export default DialogAddMed;
