import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { FC, memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../Component/FormDialog/FormDialog";
import SingleCheckboxHookForm from "../../Component/HookForm/SingleCheckboxHookForm";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import ConsultRequestActions from "../../Services/Actions/ConsultRequestActions";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import ConsultRequestApi from "../../Services/Api/ConsultRequestApi";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";

interface IWriteDiagnosisDialog {
  consult_info: ConsultRequestEntity;
  successCallback: () => void;
  open_dialog: boolean;
  handleClose: () => void;
}

const form_schema = yup.object({
  diagnosis: yup.string().required().nullable().label("Diagnosis"),
  is_advice_admit: yup.string().nullable().label("Adviced to Admit"),
});

const WriteDiagnosisDialog: FC<IWriteDiagnosisDialog> = memo(
  ({ consult_info, successCallback, open_dialog, handleClose }) => {
    const dispatch = useDispatch();

    const [error_page_message, set_error_page_message] = useState("");

    const form_instance = useForm<any>({
      resolver: yupResolver(form_schema),
      mode: "onChange",
      defaultValues: {
        diagnosis: consult_info.diagnosis,
        is_advice_admit: consult_info?.is_advice_admit === "y" ? "y" : null,
      },
    });

    const handleSubmitForm = useCallback(
      async (payload: ConsultRequestEntity) => {
        payload.consult_req_pk = consult_info.consult_req_pk;

        console.log(`payload.is_advice_admit`, payload.is_advice_admit);

        if (!!payload?.is_advice_admit) {
          payload.is_advice_admit = "y";
        } else {
          payload.is_advice_admit = "n";
        }

        if (!!payload.consult_req_pk) {
          dispatch(
            setGeneralPrompt({
              open: true,
              custom_title: `Are you sure that you want to save this patient's diagnosis?`,
              continue_callback: async () => {
                dispatch(
                  showPageLoading({
                    show: true,
                    loading_message:
                      "Saving changes, thank you for your patience",
                  })
                );
                const response = await ConsultRequestApi.SavePatientDiagnosis(
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
                  if (typeof successCallback === "function") {
                    successCallback();
                    handleClose();
                  }

                  dispatch(ConsultRequestActions.SetOpenSchedDialog(false));
                }
              },
            })
          );
        }
      },
      [consult_info, dispatch, handleClose, successCallback]
    );

    return (
      open_dialog && (
        <>
          <FormDialog
            title="Write or update the patient's diagnosis"
            open={open_dialog}
            handleClose={() => {
              handleClose();
            }}
            minWidth={650}
            body={
              !!error_page_message ? (
                <Alert severity="error">{error_page_message}</Alert>
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
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextFieldHookForm
                            name="diagnosis"
                            fullWidth
                            label="Diagnosis"
                            placeholder="Write the patient's diagnosis here..."
                            multiline={true}
                            rows={10}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <SingleCheckboxHookForm
                            label="Do you want to advice this patient for admission?"
                            name="is_advice_admit"
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </form>
                </FormProvider>
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
                  Save Patient Diagnosis
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  type="reset"
                  onClick={async () => {
                    form_instance.reset();
                  }}
                >
                  Reset
                </Button>
              </>
            }
          />
        </>
      )
    );
  }
);

export default WriteDiagnosisDialog;
