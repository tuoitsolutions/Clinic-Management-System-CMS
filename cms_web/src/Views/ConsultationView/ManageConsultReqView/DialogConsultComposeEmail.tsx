import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import EmailModel from "../../../Services/Models/EmailModel";

interface IDialogComposeConsultEmail {
  open: boolean;
  handleCloseDialog: () => void;
  successCallback: () => void;
  consult_req_pk: string;
}

const form_schema = yup.object({
  email_body: yup
    .string()
    .required()
    .min(1)
    .max(150)
    .nullable()
    .label("Email Content"),
});

const DialogComposeConsultEmail: FC<IDialogComposeConsultEmail> = memo(
  (props) => {
    const dispatch = useDispatch();

    const form_def_val = {
      email_body: "",
    };

    const form_instance = useForm<any>({
      resolver: yupResolver(form_schema),
      mode: "onChange",
      defaultValues: form_def_val,
    });

    const handleSubmitForm = useCallback(
      async (payload: EmailModel) => {
        payload.consult_req_pk = props.consult_req_pk;

        if (!!payload.consult_req_pk) {
          dispatch(
            setGeneralPrompt({
              open: true,
              custom_title: `Are you sure that you want to send this email?`,
              continue_callback: async () => {
                dispatch(
                  showPageLoading({
                    show: true,
                    loading_message:
                      "Sending email, thank you for your patience",
                  })
                );
                const response = await ConsultRequestApi.SendConsultEmail(
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
          title="Compose Email for the Consult Requester"
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
                          name="email_body"
                          label="Email Content"
                          required
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          placeholder="Write the email that you want to send to the consult requester here"
                          multiline
                          rowsMax={8}
                          rows={8}
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
  }
);

export default DialogComposeConsultEmail;
