import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import SingleCheckboxHookForm from "../../../Component/HookForm/SingleCheckboxHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import { SendMessagePayload } from "../../../Services/Entities/ConsultRequestEntity";

interface IDialogUndeclineConsult {
  open: boolean;
  consult_req_pk: string;
  handleCloseDialog: () => void;
  successCallback: () => void;
}

const form_schema = yup.object({
  body: yup.string().nullable().label("Body"),
  send_to_email: yup.string().nullable().label("Send To Email"),
  send_to_sms: yup.string().nullable().label("Send To SMS"),
});

const DialogUndeclineConsult: FC<IDialogUndeclineConsult> = memo((props) => {
  const dispatch = useDispatch();

  const def_val = {
    body: "",
    send_to_email: true,
    send_to_sms: true,
  };

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: def_val,
  });

  const handleSubmitForm = useCallback(
    async (payload: SendMessagePayload) => {
      payload.consult_req_pk = props.consult_req_pk;

      console.log(`payload`, payload);

      if (!!payload.consult_req_pk) {
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to reapprove this consultation request?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message:
                    "Reapproving consultation request, thank you for your patience",
                })
              );
              const response = await ConsultRequestApi.UndeclineConsultRequest(
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
        title="Inform the requester about the  reason for reapproving"
        open={props.open}
        handleClose={props.handleCloseDialog}
        minWidth={500}
        body={
          <FormProvider {...form_instance}>
            <form
              onSubmit={form_instance.handleSubmit(handleSubmitForm)}
              noValidate
              id="form_instance"
            >
              <div
                style={{
                  padding: `1.5em`,
                  backgroundColor: `#fff`,
                  borderRadius: 10,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextFieldHookForm
                      label="Write a message that you want to send to the requester"
                      name="body"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      multiline={true}
                      rows={3}
                      placeholder="Write a message that you want to send to the requester here..."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <SingleCheckboxHookForm
                      label="Send to the requester's mobile number"
                      name="send_to_sms"
                      size="small"
                    />

                    <SingleCheckboxHookForm
                      label="Send to the requester's email"
                      name="send_to_email"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </div>
            </form>
          </FormProvider>
        }
        actions={
          <>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              form="form_instance"
            >
              Continue
            </Button>
            <Button
              variant="contained"
              color="secondary"
              type="reset"
              onClick={async () => {
                form_instance.reset(def_val);
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

export default DialogUndeclineConsult;
